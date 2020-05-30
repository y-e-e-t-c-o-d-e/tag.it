import React, {useState, useEffect } from "react";
import Button from "../../components/Button/index";
import './style.css';
import API from "../../utils/API";

function Invitation( {history}, props){

    const [courseName, setCourseName] = useState("CSE 111 - Hardware Engineering");
    const uuid = props.uuid || "FakeUUID";

    useEffect(() => {
        API.getCourse(uuid).then((course) => {
            setCourseName(course.name)
        }).catch(() => {
            setCourseName('CSE 111 - Hardware Engineering')
        })
        console.log(courseName);
    }, [])

    const redirectHome = () => {
        alert("Redirecting to home page...");
        history.push("/");
    }

    const redirectClass = () => {
        let link = "/course/" + uuid;
        alert("Invitation accepted! Redirecting to class...");
        history.push(link);
    }
    
    return(
        <div>
            {/* Insert Nav bar here... */}
            <div className="content">
                <div className="box">

                    {/* Heading and line after */}
                    <div className="center-items">
                        <h1>Class Invitation</h1>
                        <hr/>
                        <div className="invite-message">
                            <p>You have been invited to join</p>
                            <p className="invite-course-title">{courseName}</p>
                        </div>

                        <div className="invite-buttons">
                            <Button text="cancel" onSubmit={redirectHome}/>
                            <Button text="accept" onSubmit={redirectClass}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invitation;