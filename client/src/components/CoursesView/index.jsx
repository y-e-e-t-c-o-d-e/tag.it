import React, { useState, useEffect } from 'react'
import { Button, Jumbotron, Row, Col } from "react-bootstrap";
import { API, courseToLink } from "../../utils"
import './style.css';

const CoursesView = ({username}) => {
    const [courses, setCourses] = useState([ { name: "Courses Loading", uuid: "/" } ])

    useEffect(() => {
        API.getAllCourses().then(courses => {
            console.log(courses.data)
            setCourses(courses.data);
        }).catch(() => {
            setCourses([ { name: "Error Loading Courses", uuid: "/" }])
        })
    }, [])

    return (
        <div className="courses-view">
            <Jumbotron>
                <h1>Welcome, {username}</h1>
                <p>
                    This is tag.it! Choose or add a course below to engage in your classes.
                </p>
                <div className="courses-container">
                    { courses.map((course, key) => {
                        return (<div>
                            <Button className="course-btn" key={key} variant="primary" href={courseToLink(course.uuid)}>{course.name}</Button>
                            <br/>
                            </div>
                        )
                    })}
                </div>
            </Jumbotron>
        </div>
    );
}

export default CoursesView