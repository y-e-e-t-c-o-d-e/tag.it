import React, {useRef, useState, useEffect } from "react";
import {Button} from 'react-bootstrap';
import Navigation from "../../components/Navbar"
import './style.css';
import API from "../../utils/API";
import { useParams } from "react-router-dom";
import AutocompleteTags from "../../components/AutocompleteTags";
import { createToast } from "../../utils";

const bgColors = {
    "default": "white",
    "error": "#ffcccc",
};

const ClassSettings = ({ currentUser, match}) => { 
    const { courseId } = useParams();

    const [course, setCourse] = useState({instructorInviteId: "2yiYLXnrgl",
        instructorList: ["dummy_user_id"],
        name: "cse110",
        postList: [],
        studentInviteId: "8foqG61ZzI",
        studentList: [],
        tagList: [],
        term: "sp20",
        type: "instructor",
        uuid: "-M8UP_zBwB4OtDnGu5QR",
        description: "yeet"
    })
    
    const [tags, onChangeSetTags] = useState([]);
    const [courseNameValid, setCourseNameValid] = useState(true); // Invalid if empty
    const [courseName, setCourseName] = useState("Default Class Name");
    const invitationRef = useRef(null);

    let link = "https://tagdotit.netlify.app/course/" + courseId;

    useEffect(() => {
        API.getCourse(courseId).then((response) => {
            console.log(response.data)
            setCourse(response.data)
            setCourseName(response.data.name)
        }).catch(() => {
            setCourseName('Default Class Name')
        })
    }, [])
    
    /* Updates the DB with the new class name and description */
    const handleSettingsChange = async (event) =>{
        if(courseNameValid) {
            event.preventDefault();
            const className = courseName;
            // updated the course name
            // TODO: Get some way to get the courseUUID (via props?)
            API.updateCourse(courseId, className).then(() => {
                createToast("Changed Course Name!")
            })
        }

        // set tags
        
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
            <Navigation currentUser={currentUser} />
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
                            <textarea type="text" defaultValue={course.description}>

                            </textarea> 
                        </label>

                        <label>
                            <div className="invitation-section">
                                <span>Invitation:{'\u00A0'} {'\u00A0'}</span>
                                <textarea readOnly ref={invitationRef}
                                    className="invitation-link" type="text" value={link}>
                                </textarea> 
                                <Button onClick={copyLinkToClipboard}>Copy</Button>
                            </div>
                        </label>
                        <div className="center-button">
                        </div>
                        <div className="buttons">
                            <Button>Instructors</Button>
                            <Button>Tags</Button>
                            <Button>Archive</Button>
                            <Button>Disable</Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                        <AutocompleteTags onChange={onChangeSetTags} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClassSettings;