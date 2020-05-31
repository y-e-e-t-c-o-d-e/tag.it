import React, {useState, useEffect } from "react";
import Button from "../../components/Button/index";
import './style.css';
import API from "../../utils/API";

function Invitation(props){

     const [state, setState] = useState({
        courseName: "CSE 111 - Hardware Engineering",
        pending: true,
        accountType: null // Either "student" or "instructor" (indicates verification)
    });

    const history = props.history;
    const courseId = props.match.params.courseId;
    const inviteId = props.match.params.inviteId;

    useEffect(() => {
        API.getCourse(courseId).then((course) => {
            console.log("running");

            // Runs second backend request to verify
            API.confirmVerificationLink(courseId, inviteId).then((result) => {
                setState({
                    courseName: course.name,
                    pending: false,
                    accountType: result.data.type
                });
            })
        }).catch(() => {
            // Default
            setState({
                pending: false,
                accountType: null,
                courseName: 'CSE 111 - Hardware Engineering'
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

    if (state.pending) {
        return <h1>Verifying Invite Link</h1>
    } 

    if (!state.accountType) {
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
                            <p className="invite-course-title">{state.courseName}</p>
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