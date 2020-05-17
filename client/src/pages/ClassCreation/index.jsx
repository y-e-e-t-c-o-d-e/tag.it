import React, { useState, useContext } from 'react';
import db from "../../base";
import logo from "../../assets/logo.png";
import './style.css';

const bgColors = {
    "default": "white",
    "error": "#ffcccc",
};

const ClassCreation = ({ history }) => {
    /* Function to move forward to Add Staff page */
    const redirectAddStaff = () => {
        history.push("/staff")
    }

    /* Function to redirect to Home */
    const redirectHome = () => {
        history.push("/")
    }

    /* Main function for handling class creation */
    const handleClassCreation = () => {
        // TODO
    }

    return (
        <div>
            <div className="header">
                <img src={logo} alt="Tag.it" height="50" />
            </div>
            <div className="container">
                <h1>Create a Class</h1>
                <div className="input">
                    {/* Main class creation form */}
                    <form onSubmit={handleClassCreation}>
                        <label>
                            <p>Course Title</p>
                            <input name="title" type="text" placeholder="Course Title" />
                        </label>
                        <label>
                            <p>Course Term</p>
                            <select name="term">
                                <option value="SS1">Summer Session I</option>
                                <option value="SS2">Summer Session II</option>
                                <option value="FA20">Fall 2020</option>
                            </select>
                        </label>
                        <button type="submit" onClick={redirectAddStaff}>Next</button>
                    </form>
                </div>
                {/* Cancel creating a class */}
                <div className="input">
                    <button onClick={redirectHome}>Cancel</button>
                </div>
            </div>

        </div>
    );
};

export default ClassCreation;