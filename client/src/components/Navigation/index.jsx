import React, { useState } from 'react';
import { useParams } from "react-router-dom"
import { Breadcrumb, Nav, Navbar, NavDropdown } from "react-bootstrap";
import db from "../../base"
import { courseToLink } from '../../utils';
import logo from '../../assets/logo.png'
import './style.css';

const loginRender = (history) => (
    <Navbar expand="lg" inverse fluid>
        <Navbar.Brand onClick={() => {history.push('/')}}><img
            alt=""
            src={logo}
            width="130"
            height="50"
            className="d-inline-block align-top"
        />{'   '}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="">
            <Nav className="ml-auto" >
                <Nav.Link onClick={() => { history.push("/login")}}>login</Nav.Link>
                <Nav.Link onClick={() => { history.push("/signup")}}>sign up</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
)

const regularRender = (studentCourses, instructorCourses, courseId, postId, history) => {
    let items = []
    if (courseId) {
        items.push({
            name: "courses",
            href:"/"
        })
        
        items.push({
            name: courseId,
            href:`/courses/${courseId}`
        })
    }

    if (postId) {
        items.push({
            name: "posts",
            href:`/courses/${courseId}`
        })
        
        items.push({
            name: postId,
            href:`/courses/${courseId}/posts/${postId}`
        })
    }



    return (
        <div>
            <Navbar expand="lg" inverse fluid>
                <Navbar.Brand onClick={() => {history.push("/")}}><img
                    alt=""
                    src={logo}
                    width="130"
                    height="50"
                    className="d-inline-block align-top"
                />{'   '}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="">
                    <Nav className="ml-auto" >
                        <Nav.Link onClick={() => {history.push("/")}}>home</Nav.Link>
                        <NavDropdown title="courses" id="basic-nav-dropdown">
                            { studentCourses.length > 0 && 
                                studentCourses.map((course, key) => {
                                    return <NavDropdown.Item key={key} onClick={ () => { history.push(courseToLink(course.uuid)) }}>{course.name}</NavDropdown.Item>
                                })
                            }
                            <NavDropdown.Divider />
                            { instructorCourses.length > 0 && 
                                instructorCourses.map((course, key) => {
                                    return <NavDropdown.Item key={key} onClick={ () => { history.push(courseToLink(course.uuid)) }}>{course.name}</NavDropdown.Item>
                                })
                            }
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={() => {history.push(`/add`)}}>Add a Course</NavDropdown.Item>
                        </NavDropdown>

                        { courseId && 
                            <Nav.Link onClick={() => {history.push(`/courses/${courseId}/settings`)}}>settings</Nav.Link>
                        }
                        <Nav.Link onClick={() => {history.push(`/create-course`)}}>create course</Nav.Link>
                        <Nav.Link onClick={ () => { db.auth().signOut(); history.push(`/`) } }>logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                { items.map((item, key) => {
                    return <Breadcrumb.Item onClick={() => {
                        history.push(item.href)
                    }} key={key}>
                    {item.name}
                </Breadcrumb.Item>
                })}
            </Breadcrumb>
        </div>
    )
}

const Navigation = ({currentUser, history}) => {    
    const [studentCourses, setStudentCourses] = useState([])
    const [instructorCourses, setInstructorCourses] = useState([])

    const { courseId, postId } = useParams()
    
    if (currentUser && studentCourses.length !== currentUser.filledInStudentCourseList.length) {
        setStudentCourses(currentUser.filledInStudentCourseList)
    }
    
    if (currentUser && instructorCourses.length !== currentUser.filledInInstructorCourseList.length) {
        setInstructorCourses(currentUser.filledInInstructorCourseList)
    }
    
    if (currentUser) {
        return regularRender(studentCourses, instructorCourses, courseId, postId, history);
    } else {
        return loginRender(history);
    }
}

export default Navigation;