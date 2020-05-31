import React, { useState, useEffect } from 'react';
import logo from "../../assets/logo.png";
import './style.css';
import API from "../../utils/API";

const Staff = ({ history, match, currentUser }) => {

    const [currCourses, setCurrCourses] = useState([]);
    const [emailToIdMap, setEmailToIdMap] = useState({});

    const courseId = match.params.courseId;
    let pendingRequest = false;

    useEffect(() => {
        API.getCourseUsers(courseId).then((data) => {
            setCurrCourses(data.data.instructors.map((instructorObj) => instructorObj.email));
            setEmailToIdMap(data.data.instructors.reduce((acc, instructorObj) => {
                acc[instructorObj.email] = instructorObj.uuid;
                return acc;
            }, {}))
        });
    }, []);    

    /* Function to redirect to Home */
    const redirectHome = () => {
        history.push("/")
    }

    /* Function for handling inviting staff */
    const handleStaffInvite = async (event) => {
        event.preventDefault();
        const { email } = event.target.elements;

        // try to add staff to course in database
        try {
            const userId = await API.inviteUser(email);
            const mapCopy = {...emailToIdMap};
            mapCopy[userId] = email;
            setEmailToIdMap(mapCopy);
            setCurrCourses(currCourses.concat(email.value));

            event.target.reset();
        } catch (error) {
            alert(error);
        }
    }

    const removeInstructor = async (instructor) => {
        try {
            if (!pendingRequest) {
                pendingRequest = true;
                await API.removeUserFromCourse(courseId, emailToIdMap[instructor]);
                pendingRequest = false;
                setCurrCourses(currCourses.filter((val) => val !== instructor));
            }
            
        } catch (error) {
            alert("An error occurred when removing this instructor.");
        }
    }

    const renderClassInstructors = () => {
        const instructorEmails = currCourses.map((val) =>
            <button className="email-button" onClick={() => removeInstructor(val)}>{val}</button>
        );
        return instructorEmails;
    }

    return (
        <>
            <div className="header">
                <img src={logo} alt="Tag.it" height="50" />
            </div>
            <div className="flex-instructors">
                <div className="invite-box">
                    <div className="invite-content">
                        <h1>Inviting Instructors</h1>
                        <p>Currently inviting instructors for</p>
                        <h2>Enter Instructor Email (e.g. username@ucsd.edu)</h2>
                        <form onSubmit={handleStaffInvite}>
                            <input name="email" type="email" placeholder="Add new instructor email" required="required" pattern=".+@ucsd\.edu" style={{ backgroundColor: "#e6e5e5" }} />
                            <div className="input invite-button">
                                <button type="submit">Invite</button>
                            </div>
                        </form>
                        <p>*Instructors will have access to the class setting page, and will be able to manage tags, pin posts, make announcements, etc.</p>
                    </div>
                    <div className="input return-button">
                        <button onClick={redirectHome}>Return to Course</button>
                    </div>
                </div>
                <div className="curr-instructors">
                    <h3>Current Instructors:</h3>
                    <div className="scroll-instructors">
                        {renderClassInstructors()}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Staff;