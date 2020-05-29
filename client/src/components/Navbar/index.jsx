import React, { useState, useContext, useEffect } from 'react';
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { AuthContext } from "../../auth/Auth";
import './style.css';
import tagit from '../../assets/tagit-darkercoral\ 1.svg'
import db from "../../base"
import API from "../../utils/API"

const loginRender = () => (
    <Navbar expand="lg" inverse fluid>
        <Navbar.Brand href="#home"><img
            alt=""
            src={tagit}
            width="50"
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

const regularRender = (courses) => {
    return (
        <Navbar expand="lg" inverse fluid>
            <Navbar.Brand href="#home"><img
                alt=""
                src={tagit}
                width="50"
                height="50"
                className="d-inline-block align-top"
            />{'   '}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="">
                <Nav className="ml-auto" >
                    { courses.length > 0 && 
                        <NavDropdown title="courses" id="basic-nav-dropdown">
                            {
                                courses.map((course, key) => {
                                   return <NavDropdown.Item key={key} href={`/courses/${course.uuid}`}>{course.name}</NavDropdown.Item>
                                })
                            }
                        </NavDropdown>
                    }
                    <Nav.Link href="/calendar">calendar</Nav.Link>
                    <Nav.Link href="/" onClick={ () => { db.auth().signOut() } }>logout</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

const Navigation = ({}) => {
    const { currentUser } = useContext(AuthContext);
    
    const [courses, setCourses] = useState([ { name: "Courses Loading", uuid: "/" } ])

    useEffect(() => {
        if (!currentUser) { return; } // don't look for courses if the user isn't logged in

        API.getAllCourses().then(courses => {
            console.log(courses.data)
            setCourses(courses.data);
        }).catch(() => {
            setCourses([ { name: "Error Loading Courses", uuid: "/" }])
        })
    }, [])
    
    if (currentUser) {
        return regularRender(courses);
    } else {
        return loginRender();
    }
}

export default Navigation;