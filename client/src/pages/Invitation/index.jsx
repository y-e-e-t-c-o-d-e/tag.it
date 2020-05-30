import React, {useState, useEffect } from "react";
import Button from "../../components/Button/index";
import './style.css';
import API from "../../utils/API";

function Invitation(props){

    const [courseName, setCourseName] = useState("CSE 111 - Hardware Engineering");
    const [status, setStatus] = useState({
        pending: true,
        accountType: null // Either "student" or "instructor" (indicates verification)
    });

    const history = props.history;
    const courseId = props.match.params.courseId;
    const inviteId = props.match.params.inviteId;

    useEffect(() => {
        API.getCourse(courseId).then((course) => {
            setCourseName(course.name);
            setStatus({
                pending: false,
                accountType: course.studentInviteId === inviteId ? "student" :
                                course.teacherInviteId === inviteId ? "teacher" : null
            });
        }).catch(() => {
            // Default
            setCourseName('CSE 111 - Hardware Engineering');
            setStatus({
                pending: false,
                accountType: null
            })
        }); 
    }, [])

    const redirectHome = () => {
        alert("Redirecting to home page...");
        history.push("/");
    }

    const redirectClass = () => {
        API.addToCourse(courseId).then((val) => {
            let link = `/course/${courseId}`;
            alert("Invitation accepted! Redirecting to class...");
            history.push(link);
        }).catch((e) => alert(e))
    }

    if (status.pending) {
        return <h1>Verifying Invite Link</h1>
    } 

    if (!status.accountType) {
        return <h1>Invite Id is not Valid</h1>
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