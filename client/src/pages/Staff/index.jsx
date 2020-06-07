import React, { useState, useEffect } from 'react';
import { Button } from "react-bootstrap";
import { Navigation } from "../../components";
import {API, createToast} from "../../utils";
import './style.css';

const Staff = ({ history, match, currentUser }) => {

    const [currCourses, setCurrCourses] = useState([]);
    const [pendingCourses, setPendingCourses] = useState([]);
    const [emailToIdMap, setEmailToIdMap] = useState({});

    const courseId = match.params.courseId;
    let pendingRequest = false;

    useEffect(() => {
        API.getCourseUsers(courseId).then((data) => {
            console.log(data.data.pendingInstructorList);
            setCurrCourses(data.data.instructors.map((instructorObj) => instructorObj.email));
            setPendingCourses(data.data.pendingInstructorList);
            setEmailToIdMap(data.data.instructors.reduce((acc, instructorObj) => {
                acc[instructorObj.email] = instructorObj.uuid;
                return acc;
            }, {}))
        }).catch((e) => {
            console.error(e)
            createToast(e);
        });
    }, []);    

    /* Function for handling inviting staff */
    const handleStaffInvite = async (event) => {
        event.preventDefault();
        const email = event.target.elements.email.value;

        // if email is the same as existing pending or current instructor, do not invite
        if (emailToIdMap[email]) { 
            createToast("User already exists as an instructor in this course"); 
            return;
        }

        // try to add staff to course in database
        try {
            await API.inviteUserToCourse(courseId, email);
            setPendingCourses(pendingCourses.concat(email));
        } catch (error) {
            createToast(error);
        }
    }

    const removeInstructor = async (instructor) => {
        try {
            if (!pendingRequest) {
                pendingRequest = true;

                // Map only contains confirmed users
                if (emailToIdMap[instructor]) {
                    await API.removeUserFromCourse(courseId, emailToIdMap[instructor]);
                    pendingRequest = false;
                } else {
                    await API.removePendingUserFromCourse(courseId, instructor);
                    pendingRequest = false;
                }
            }
            setCurrCourses(currCourses.filter((val) => val !== instructor));
            setPendingCourses(pendingCourses.filter((val) => val !== instructor));
        } catch (error) {
            createToast("An error occurred when removing this instructor.");
        }
    }

    const renderClassInstructors = () => {
        const instructorEmails = currCourses.map((val, key) =>
            <button key={key} className="email-button" onClick={() => removeInstructor(val)}>{val}</button>
        );

        const pendingInstructors = pendingCourses.map((val, key) =>
            <button key={key} className="email-button" style={{backgroundColor: "yellow"}}onClick={() => removeInstructor(val)}>{val}</button>
        );

        return instructorEmails.concat(pendingInstructors);
    }

    return (
        <>
            <Navigation history={history}  currentUser={currentUser} />
            <div className="flex-instructors">
                <div className="invite-box">
                    <div className="invite-content">
                        <h1>Inviting Instructors</h1>
                        <p>Currently inviting instructors for</p>
                        <h2>Enter Instructor Email (e.g. username@ucsd.edu)</h2>
                        <form onSubmit={handleStaffInvite}>
                            <input name="email" type="email" placeholder="Add new instructor email" required="required"  style={{ backgroundColor: "#e6e5e5" }} />
                            <div className="input">
                                <Button id="invite-button" type="submit">Invite</Button>
                            </div>
                        </form>
                        <p>*Instructors will have access to the class setting page, and will be able to manage tags, pin posts, make announcements, etc.</p>
                    </div>
                    <div className="input">
                        <Button id="return-button" href={`/courses/${courseId}`}>Return to Course</Button>
                        <Button id="return-button" href={`/courses/${courseId}/settings`}>Return to Course Settings</Button>
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