import React, { useState } from 'react';
import db from "../../base";
import logo from "../../assets/logo.png";
import './style.css';
import API from "../../utils/API";
import AutocompleteTags from '../../components/AutocompleteTags';

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

    /* Check if input form is valid */
    const [titleValid, setTitleValid] = useState(false);
    const [descValid, setDescValid] = useState(false);

    /* Main function for handling class creation */
    const handleClassCreation = async (event) => {
        if (titleValid && descValid) {
            event.preventDefault();
            // TODO: add tags if they've been set
            const { title, description, term } = event.target.elements;

            /* try to create a course in database */
            try {
                // TODO: use API to create course
                redirectAddStaff();
            } catch (error) {
                alert(error);
            }
        } else {
            if (!titleValid) { alert("Please enter a course title"); }
            else if (!descValid) { alert("Please enter a course description"); }
        }
    }

    /* Makes possible title input background color change  */
    const [titleBgColor, setTitleBgColor] = useState(
        bgColors.default
    );

    /* Makes sure title has the correct format */
    const handleTitleChange = (event) => {

        // Checking for format of the name
        const titleInput = event.target.value;
        let inputArr = titleInput.split(' - ');
        let courseCodeValid;
        let courseNameValid;
        if (inputArr.length > 1) {
            courseCodeValid = inputArr[0].length > 0;
            courseNameValid = inputArr[1].length > 0;
        }

        // If invalid, indicate an error
        if (titleInput === "" || !courseCodeValid || !courseNameValid) {
            setTitleBgColor(bgColors.error);
            setTitleValid(false);
        }

        // If valid, indicate valid
        else {
            setTitleBgColor(bgColors.default);
            setTitleValid(true);
        }

    }

    /* Makes possible description input background color change  */
    const [descBgColor, setDescBgColor] = useState(
        bgColors.default
    );

    /* Makes sure description has the correct format */
    const handleDescChange = (event) => {

        // Checking for format of the name
        const descInput = event.target.value;

        // If invalid, indicate an error
        if (descInput === "") {
            setDescBgColor(bgColors.error);
            setDescValid(false);
        }

        // If valid, indicate valid
        else {
            setDescBgColor(bgColors.default);
            setDescValid(true);
        }

    }

    return (
        <div>
            <div className="header">
                <img src={logo} alt="Tag.it" height="50" />
            </div>
            <div className="container">
                <div className="container-title">
                    <h1>Create a Class</h1>
                </div>
                <div className="input">
                    {/* Main class creation form */}
                    <form onSubmit={handleClassCreation}>
                        <div className="flex-row">
                            <p>Course Title:</p>
                            <input name="title" placeholder="Ex: CSE 111 - History of LeetCode" onBlur={handleTitleChange} style={{ backgroundColor: titleBgColor }} />
                        </div>
                        <div className="flex-row">
                            <p>Description:</p>
                            <textarea name="description" placeholder="Description" onBlur={handleDescChange} style={{ backgroundColor: descBgColor }}></textarea>
                        </div>
                        <div className="flex-row">
                            <p>Course Term:</p>
                            <select name="term">
                                <option value="SS1">Summer Session I</option>
                                <option value="SS2">Summer Session II</option>
                                <option value="FA20">Fall 2020</option>
                            </select>
                        </div>
                        <div className="flex-row">
                            <p>Initial Tags (Optional):</p>
                            <AutocompleteTags type={"classTag"} />
                        </div>
                        <button type="submit">Next Step: Adding Instructors</button>
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