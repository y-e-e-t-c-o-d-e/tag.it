import React, { useState } from 'react';
import db from "../../base";
import logo from "../../assets/logo.png";
import './style.css';
import API from "../../utils/API";

const bgColors = {
    "default": "#e6e5e5",
    "error": "#ffcccc",
};

/* hardcoded */
const currCourse = {
    instructorList: ["hechan@ucsd.edu"]
}

const Staff = ({ history }) => {
    /* Function to redirect to Home */
    const redirectHome = () => {
        history.push("/")
    }

    /* Checks whether the input form is valid */
    const [emailValid, setEmailValid] = useState(false);

    /* Makes possible email input background color change  */
    const [emailBgColor, setEmailBgColor] = useState(
        bgColors.default
    );

    /* When input for email address changes, try to validate the email address */
    const handleEmailChange = (event) => {
        const emailInput = event.target.value;
        let lastAtPos = emailInput.lastIndexOf('@');
        let lastDotPos = emailInput.lastIndexOf('.');

        // Logics used to check validity of email input
        let validFormat = lastAtPos > 0 && lastDotPos > 2 && lastAtPos < lastDotPos;
        let containsDoubleAt = emailInput.lastIndexOf('@@') !== -1;
        let validOrgNameLength = emailInput.length - lastDotPos > 2;

        // If any of the logics are not satisfied, change the background color to red
        if (emailInput === "" || !validFormat || !validOrgNameLength || containsDoubleAt) {
            setEmailBgColor(bgColors.error);
            setEmailValid(false);
        }

        // Otherwise, set the background color as light blue (to indicate correctness)
        else {
            setEmailBgColor(bgColors.default);
            setEmailValid(true);
        }
    }

    /* Function for handling inviting staff */
    const handleStaffInvite = (event) => {
        console.log('yes');
        event.preventDefault();
        if (emailValid) {
            const { email } = event.target.elements;

            // try to add staff to course in database
            try {
                // TODO: API stuff, check if already in database
                currCourse.instructorList.push(email.value);
                console.log(currCourse.instructorList)
                event.target.reset();
            } catch (error) {
                alert(error);
            }
        } else {
            alert("Please enter a valid instructor email.");
        }
    }

    const removeInstructor = (event) => {
        try {
            // TODO: API stuff, remove course from instructorList
            currCourse.instructorList.splice(currCourse.instructorList.indexOf(event.target.value), 1);
        } catch (error) {
            alert("An error occurred when removing this instructor.");
        }
    }

    const renderClassInstructors = () => {
        console.log("line " + currCourse.instructorList);
        const instructorEmails = currCourse.instructorList.map((val) =>
            <button className="email-button" onClick={removeInstructor}>{val}</button>
        );
        return instructorEmails;
    }

    return (
        <div>
            <div className="header">
                <img src={logo} alt="Tag.it" height="50" />
            </div>
            <div className="flex-instructors">
                <div className="invite-box">
                    <div className="invite-content">
                        <h1>Inviting Instructors</h1>
                        <p>Currently inviting instructors for</p>
                        <h2>Enter Instructor Email</h2>
                        <form onSubmit={handleStaffInvite}>
                            <input name="email" type="email" placeholder="Add new instructor email" onBlur={handleEmailChange} style={{ backgroundColor: emailBgColor }} />
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
        </div>
    );
};

export default Staff;