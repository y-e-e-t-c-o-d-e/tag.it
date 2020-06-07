import React, { useState } from 'react';
import { Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { AutocompleteTags, Navigation } from "../../components"
import { API, createToast } from "../../utils"
import './style.css';


const bgColors = {
    "default": "white",
    "error": "#ffcccc",
};

const ClassCreation = ({ currentUser, history }) => {
    /* Function to move forward to Add Staff page */
    const redirectAddStaff = (id) => {
        history.push("/courses/" + id + "/staff");
    }

    /* Function to redirect to Home */
    const redirectHome = () => {
        history.push("/")
    }

    /* Check if input form is valid */
    const [titleValid, setTitleValid] = useState(false);
    const [descValid, setDescValid] = useState(false);
    const [courseTerm, setCourseTerm] = useState("SS1");

    /* Update state of selected tags */
    const [selectedTags, setSelectedTags] = useState([]);

    /* Main function for handling class creation */
    const handleClassCreation = async (event) => {
        event.preventDefault();
        if (titleValid && descValid) {
            const { title, description } = event.target.elements;
            /* try to create a course in database */
            try {
                const tags = selectedTags.map(tag => tag.name)
                const courseId = (await API.createCourse(title.value, courseTerm, description.value, tags)).data;
                redirectAddStaff(courseId); // might need to change depending on how backend implements the return value
            } catch (error) {
                createToast(error);
                console.error(error);
            }
        } else {
            if (!titleValid) { createToast("Course Title should have format: [Course Code] - [Course Name]"); }
            else if (!descValid) { createToast("Please enter a course description"); }
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
            <Navigation history={history} currentUser={currentUser} />
            <div className="container">
                <div className="container-title">
                    <h1>Create a Course</h1>
                </div>
                <div className="input">
                    {/* Main class creation form */}
                    <Form onSubmit={handleClassCreation}>
                        <div className="inputField">
                            <Form.Label>Course Title:</Form.Label>
                            <Form.Control name="title" placeholder="Ex: CSE 111 - History of LeetCode" onChange={handleTitleChange} onBlur={handleTitleChange} style={{ backgroundColor: titleBgColor }} />
                        </div>
                        <div className="inputField">
                            <Form.Label>Description:</Form.Label>
                            <Form.Control as="textarea" name="description" placeholder="Description" onChange={handleDescChange} onBlur={handleDescChange} style={{ backgroundColor: descBgColor }} />
                        </div>
                        <div className="inputField" id="term-selection">
                            <Form.Label>Course Term:{'\u00A0'}{'\u00A0'}</Form.Label>
                            <DropdownButton name="term" variant="warning" title={courseTerm}>
                                <Dropdown.Item onClick={() => { setCourseTerm("SS1") }}>Summer Session I</Dropdown.Item>
                                <Dropdown.Item onClick={() => { setCourseTerm("SS2") }}>Summer Session II</Dropdown.Item>
                                <Dropdown.Item onClick={() => { setCourseTerm("FA20") }}>Fall 2020</Dropdown.Item>
                            </DropdownButton>
                        </div>
                        <div className="inputField">
                            <Form.Label>Initial Tags (Optional):</Form.Label>

                            <AutocompleteTags initialTags={[]} setAddedTags={(tags) => {

                            }} setDeletedTags={(tags) => {

                            }} onChange={(tags) => {
                                setSelectedTags(tags)
                            }} />
                        </div>
                        <Button id="next-button" variant="warning" type="submit">Next Step: Adding Instructors</Button>
                    </Form>
                </div>
                {/* Cancel creating a class */}
                <div className="input">
                    <Button id="cancel-button" variant="warning" onClick={redirectHome}>Cancel</Button>
                </div>
            </div>

        </div>
    );
};

export default ClassCreation;