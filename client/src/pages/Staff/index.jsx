import React, { useState } from 'react';
import logo from "../../assets/logo.png";
import './style.css';
import API from "../../utils/API";

const Staff = ({ history }) => {
    /* hardcoded
    const [currCourses, setCurrCourses] = useState([]);
    */

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