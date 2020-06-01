import React, { useState, useContext, useEffect } from 'react';
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useParams } from "react-router-dom"
import { AuthContext } from "../../auth/Auth";
import './style.css';
import logo from '../../assets/logo.png'
import db from "../../base"
import API from "../../utils/API"
import { courseToLink } from '../../utils';

const loginRender = () => (
    <Navbar expand="lg" inverse fluid>
        <Navbar.Brand onClick={() => {window.location.href="/"}}><img
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
                <Nav.Link href="/login">login</Nav.Link>
                <Nav.Link href="/signup">sign up</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
)

const regularRender = (studentCourses, instructorCourses, courseId) => {
    return (
        <Navbar expand="lg" inverse fluid>
            <Navbar.Brand onClick={() => {window.location.href="/"}}><img
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
                    <Nav.Link href="/">home</Nav.Link>
                    <NavDropdown title="courses" id="basic-nav-dropdown">
                        { studentCourses.length > 0 && 
                            studentCourses.map((course, key) => {
                                return <NavDropdown.Item key={key} href={courseToLink(course.uuid)}>{course.name}</NavDropdown.Item>
                            })
                        }
                        <NavDropdown.Divider />
                        { instructorCourses.length > 0 && 
                            instructorCourses.map((course, key) => {
                                return <NavDropdown.Item key={key} href={courseToLink(course.uuid)}>{course.name}</NavDropdown.Item>
                            })
                        }
                        <NavDropdown.Divider />
                        <NavDropdown.Item href={`/add`}>Add a Course</NavDropdown.Item>
                    </NavDropdown>

                    { courseId && 
                        <Nav.Link href={`/courses/${courseId}/settings`}>settings</Nav.Link>
                    }
                    <Nav.Link href="/create-course">create course</Nav.Link>
                    <Nav.Link href="/" onClick={ () => { db.auth().signOut() } }>logout</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

const Navigation = ({currentUser}) => {    
    const [studentCourses, setStudentCourses] = useState([])
    const [instructorCourses, setInstructorCourses] = useState([])

    const { courseId } = useParams()
    
    if (currentUser && studentCourses.length !== currentUser.filledInStudentCourseList.length) {
        setStudentCourses(currentUser.filledInStudentCourseList)
    }
    
    if (currentUser && instructorCourses.length !== currentUser.filledInInstructorCourseList.length) {
        setInstructorCourses(currentUser.filledInInstructorCourseList)
    }
    
    if (currentUser) {
        return regularRender(studentCourses, instructorCourses, courseId);
    } else {
        return loginRender();
    }
}

export default Navigation;