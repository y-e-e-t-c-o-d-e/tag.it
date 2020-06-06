import React, { useState } from 'react'
import { Button, Jumbotron } from "react-bootstrap";
import { courseToLink } from "../../utils"
import './style.css';

const CoursesView = ({currentUser, username, history }) => {
    const [studentCourses, setStudentCourses] = useState([])
    const [instructorCourses, setInstructorCourses] = useState([])

    if (currentUser && studentCourses.length !== currentUser.filledInStudentCourseList.length) {
        setStudentCourses(currentUser.filledInStudentCourseList)
    }
    
    if (currentUser && instructorCourses.length !== currentUser.filledInInstructorCourseList.length) {
        setInstructorCourses(currentUser.filledInInstructorCourseList)
    }

    return (
        <div className="courses-view">
            <Jumbotron>
                <h1>Welcome, {username}</h1>
                <p>
                    This is tag.it! Choose or add a course below to engage in your classes.
                </p>
                <div className="courses-container">
                    { studentCourses.length > 0 && <h3>Student Courses</h3> }
                    { studentCourses.length > 0 &&
                        studentCourses.map((course, key) => {
                            return (<div>
                                <Button className="course-btn" key={key} onClick={() => { history.push(courseToLink(course.uuid)) }}>{course.name}</Button>
                                <br/>
                                </div>
                            )
                        })
                    }
                    { instructorCourses.length > 0 && <h3>Instructor Courses</h3> }
                    { instructorCourses.length > 0 &&
                        instructorCourses.map((course, key) => {
                            return (<div>
                                <Button className="course-btn" key={key} variant="success" onClick={() => { history.push(courseToLink(course.uuid)) }}>{course.name}</Button>
                                <br/>
                                </div>
                            )
                        })
                    }
                </div>
            </Jumbotron>
        </div>
    );
}

export default CoursesView