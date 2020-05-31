import React, { useState } from 'react';
import './style.css';
import API from "../../utils/API";
import Navigation from "../../components/Navbar/index.jsx";
import { Button } from "react-bootstrap";

const Staff = ({ currentUser, history, match }) => {
    //' hardcoded
    const [currCourses, setCurrCourses] = useState([]);
    const courseId = match.params.courseId;

    /* Function to redirect to Home */
    const redirectHome = () => {
        history.push("/")
    }

    /* Function for handling inviting staff */
    const handleStaffInvite = (event) => {
        event.preventDefault();
        const { email } = event.target.elements;

        // try to add staff to course in database
        try {
            // TODO: API stuff, check if already in database
            setCurrCourses(currCourses.concat(email.value));
            event.target.reset();
        } catch (error) {
            alert(error);
        }
    }

    const removeInstructor = (instructor) => {
        try {
            // TODO: API stuff, remove course from instructorList
            setCurrCourses(currCourses.filter((val) => val !== instructor));
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
            <Navigation currentUser={currentUser} />
            <div className="flex-instructors">
                <div className="invite-box">
                    <div className="invite-content">
                        <h1>Inviting Instructors</h1>
                        <p>Currently inviting instructors for</p>
                        <h2>Enter Instructor Email (e.g. username@ucsd.edu)</h2>
                        <form onSubmit={handleStaffInvite}>
                            <input name="email" type="email" placeholder="Add new instructor email" required="required" pattern=".+@ucsd\.edu" style={{ backgroundColor: "#e6e5e5" }} />
                            <div className="input">
                                <Button id="invite-button" type="submit">Invite</Button>
                            </div>
                        </form>
                        <p>*Instructors will have access to the class setting page, and will be able to manage tags, pin posts, make announcements, etc.</p>
                    </div>
                    <div className="input">
                        <Button id="return-button" onClick={redirectHome}>Return to Course</Button>
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