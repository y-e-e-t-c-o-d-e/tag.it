import React, { useState } from 'react';
import Button from "../../components/Button/index.jsx";
import './style.css';
import db from "../../base";
import Navigation from "../../components/Navbar";
import TagList from "../../components/TagList/index.jsx";
import { Row, Col, Nav } from 'react-bootstrap';
import CoursesView from '../../components/CoursesView/index.jsx';
import QuestionList from "../../components/QuestionList"

const CourseView = ({currentUser, match}) => { 
    if (match) {
        const courseId = match.params.id;
    }

    const displayName = currentUser ? currentUser.name : "Loading"

    return (
        <div className="home">
            <Navigation currentUser={currentUser} />
            <QuestionList/>
        </div>
    )

};

export default CourseView;