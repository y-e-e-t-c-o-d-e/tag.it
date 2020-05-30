import React, {useRef, useState, useEffect } from "react";
import Navigation from "../../components/Navbar"
import Button from "../../components/Button/index";
import './style.css';
import API from "../../utils/API";

const bgColors = {
    "default": "white",
    "error": "#ffcccc",
};

const ClassSettings = ({classUuid, match}) => { 
    if (match) {
        const courseId = match.params.id;
    }

    const [courseNameValid, setCourseNameValid] = useState(true); // Invalid if empty
    const [courseName, setCourseName] = useState("Default Class Name");
    const invitationRef = useRef(null);

    const uuid = classUuid || "FakeUUID";
    let link = "https://tagdotit.netlify.app/course/" + uuid;

    useEffect(() => {
        API.getCourse(uuid).then((course) => {
            setCourseName(course.name)
        }).catch(() => {
            setCourseName('Default Class Name')
        })
        console.log(courseName);
    }, [])
    
    /* Updates the DB with the new class name and description */
    const handleSettingsChange = async (event) =>{
        if(courseNameValid) {
            event.preventDefault();
            const className = courseName;
            // updated the course name
            // TODO: Get some way to get the courseUUID (via props?)
            const uuid = classUuid || "FakeUUID";
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
        setCourseName(classNameInput);
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
            <Navigation/>
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
                            Course Title:{'\u00A0'} {'\u00A0'}
                            <input name="courseTitle" 
                                onChange={handleClassNameChange} onBlur={handleClassNameChange} 
                                style={{ backgroundColor: classNameBgColor }}
                                type="text" value={courseName}
                            /> 
                        </label>

                        <label>
                            <span>Description:{'\u00A0'} {'\u00A0'}</span>
                            <textarea type="text">
                                A course with focus on hardware engineering and collaboration.
                                Prerequiisites: None. Course website: cse111.com
                            </textarea> 
                        </label>

                        <label>
                            <div className="invitation-section">
                                <span>Invitation:{'\u00A0'} {'\u00A0'}</span>
                                <textarea readOnly ref={invitationRef}
                                    className="invitation-link" type="text" value={link}>
                                </textarea> 
                                <Button text="copy" onSubmit={copyLinkToClipboard}/>
                            </div>
                        </label>
                        <div className="center-button">
                            <button type="submit">Submit</button>
                        </div>
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