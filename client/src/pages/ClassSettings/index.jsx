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

const ClassSettings = ({ currentUser, history }) => { 
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
    
    const [tags, setTags] = useState([]);
    const [courseNameValid, setCourseNameValid] = useState(true); // Invalid if empty
    const [courseName, setCourseName] = useState("Default Class Name");
    const [courseInviteLink, setCourseInviteLink] = useState("");
    const invitationRef = useRef(null);

    // form tags
    const [addedTags, setAddedTags] = useState([]);
    const [deletedTags, setDeletedTags] = useState([]);


    let link = "https://tagdotit.netlify.app/course/" + courseId;

    useEffect(() => {
        API.getCourse(courseId).then((response) => {
            console.log(response.data)
            setCourse(response.data)
            setCourseName(response.data.name)
            setTags(response.data.tagList)
            setCourseInviteLink(`https://tagdotit.netlify.app/course/${courseId}/invite/${course.studentInviteId}`)
        }).catch(() => {
            setCourseName('Default Class Name')
        })
    }, [])
    
    /* Updates the DB with the new class name and description */
    const handleSettingsChange = async (event) =>{
        if(courseNameValid) {
            event.preventDefault();

            API.updateCourse(courseId, courseName).then(() => {
                createToast("Changed Course Name!")
            })
        }
        else{
            createToast("Course name can not be empty");
        }

        // set tags
        console.log(addedTags)
        console.log(deletedTags)
        const addedSet = new Set(addedTags.map(tag => tag.name))
        const deletedSet = new Set(deletedTags.map(tag => tag.name))
        
        const added = addedTags.filter(tag => !deletedSet.has(tag.name)).map(tag => tag.name)
        const deleted = deletedTags.filter(tag => {
            return !addedSet.has(tag.name) && tag.uuid
        }).map(tag => tag.uuid)

        console.log("added tags")
        console.log(added)
        console.log("deleted tags")
        console.log(deleted)

        API.addRemoveTags(added, deleted, courseId).then(() => {
            createToast("success!")
        }).catch(err => {
            createToast(err)
        })

    };

    /* Copies invitation link to clipboard */
    const copyLinkToClipboard = (event) =>{
        invitationRef.current.select();
        document.execCommand('copy');
        event.target.focus();
        createToast("Copied to clipboard!");
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
            <Navigation  history={history} currentUser={currentUser} />
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
                                    className="invitation-link" type="text" value={courseInviteLink}>
                                </textarea> 
                                <Button onClick={copyLinkToClipboard}>Copy</Button>
                            </div>
                        </label>
                        <div className="center-button">
                        </div>
                        <div className="buttons">
                            <Button variant="warning" onClick={ () => { history.push(`/courses/${courseId}/staff`); }}>Instructors</Button>
                            <Button variant="warning">Tags</Button>
                            <Button variant="warning">Archive</Button>
                            <Button variant="warning">Disable</Button>
                            <Button variant="warning" type="submit">Save Changes</Button>
                        </div>
                        <AutocompleteTags initialTags={tags} setAddedTags={setAddedTags} setDeletedTags={setDeletedTags} onChange={() => {}} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClassSettings;