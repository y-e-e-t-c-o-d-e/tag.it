import React, {useRef, useState, useEffect } from "react";
import Button from "../../components/Button/index";
import './style.css';
import API from "../../utils/API";

const bgColors = {
    "default": "white",
    "error": "#ffcccc",
};

function ClassSettings(props){

    const [courseNameValid, setCourseNameValid] = useState(false); // Invalid if empty
    const invitationRef = useRef(null);

    const [courseName, setCourseName] = useState("idk");

    /* Updates the DB with the new class name and description */
    const handleSettingsChange = async (event) =>{
        if(courseNameValid) {
            event.preventDefault();
            const { className, courseDescription } = event.target.elements;
            // updated the course name
            // TODO: Get some way to get the courseUUID (via props?)
            const uuid = props.uuid || "FakeUUID";
            await API.updateCourse(uuid, className);
            console.log("yeet");
        }
        else{alert("Course name can not be empty");}
    };

    /* Copies invitation link to clipboard */
    const copyLinkToClipboard = (event) =>{
        invitationRef.current.select();
        document.execCommand('copy');
        event.target.focus();
        alert("Copied to clipboard!");
    };

    /* Makes possible email input background color change  */
    const [classNameBgColor, setClassNameBgColor] = useState(
        bgColors.default
    );

    const handleClassNameChange = (event) =>{
        const classNameInput = event.target.value;
        if(classNameInput === ""){
            setClassNameBgColor(bgColors.error);
            setCourseNameValid(false);
        }

        else{
            setClassNameBgColor(bgColors.default);
            setCourseNameValid(true);
        }
    }

    return(
        <div>
            {/* Insert Nav bar here... */}
            <div className="content">
                <div className="box">

                    {/* Heading and line after */}
                    <div className="center-items">
                        <h1>Class Settings</h1>
                        <hr/>
                    </div>

                    {/* Actual form with course info */}
                    <form className="course-info" onSubmit={handleSettingsChange}>
                        <label>
                            Course Title:{'\u00A0'} {'\u00A0'} { courseName }
                            <input name="courseTitle" 
                                onChange={handleClassNameChange} onBlur={handleClassNameChange} 
                                style={{ backgroundColor: classNameBgColor }}
                                type="text" value={props.courseTitle}
                            /> 
                        </label>

                        <label>
                            <span>Description:{'\u00A0'} {'\u00A0'}</span>
                            <textarea type="text" value={props.courseDescription}></textarea> 
                        </label>

                        <label>
                            <div className="invitation-section">
                                <span>Invitation： {'\u00A0'} {'\u00A0'}</span>
                                <textarea readOnly ref={invitationRef}
                                    className="invitation-link" type="text" value="YEET copy success">
                                </textarea> 
                                <Button text="copy" onSubmit={copyLinkToClipboard}/>
                            </div>
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                    <div className="buttons">
                        <Button text="instructors"/>
                        <Button text="Tags"/>
                        <Button text="Archive"/>
                        <Button text="Disable"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassSettings;