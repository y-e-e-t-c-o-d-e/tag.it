import React, { useState } from 'react';
import db from "../../base";
import logo from "../../assets/logo.png";
import './style.css';
import API from "../../utils/API";
import AutocompleteTags from '../../components/AutocompleteTags';

const Staff = ({ history }) => {
    /* Function to redirect to Home */
    const redirectHome = () => {
        history.push("/")
    }

    /* Function for handling inviting staff */
    const handleStaffInvite = async (event) => {

    }

    return (
        <div>
            <div className="header">
                <img src={logo} alt="Tag.it" height="50" />
            </div>
            <div className="flex-row">
                <div className="invite-box">
                    <h1>Inviting Instructors</h1>
                    <p>Currently inviting instructors for</p>
                    <h2>Enter Instructor Emails (Separated by spaces)</h2>
                    <form onSubmit={handleStaffInvite}>
                        <AutocompleteTags placeholder="Add instructor email" />
                        <div className="input">
                            <button type="submit">Invite</button>
                        </div>
                    </form>
                    <p>*Instructors will have access to the class setting page, and will be able to manage tags, pin posts, make announcements, etc.</p>
                    <div className="input">
                        <button onClick={redirectHome}>Return to Course</button>
                    </div>
                </div>
                <div className="curr-instructors">
                    <h3>Current Instructors:</h3>
                    <div className="scroll-instructors"></div>
                </div>
            </div>
        </div>
    );
};

export default Staff;