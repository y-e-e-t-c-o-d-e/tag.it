import React, { useState } from 'react';
import Button from "../../components/Button/index.jsx";
import './style.css';
import db from "../../base";
import Navigation from "../../components/Navbar";
import TagList from "../../components/TagList/index.jsx";
import { Row, Col, Nav } from 'react-bootstrap';
import CoursesView from '../../components/CoursesView/index.jsx';
import PostViewer from '../../components/PostViewer/index';

const Home = ({currentUser, match}) => { 
    if (match) {
        const courseId = match.params.id;
    }

    const displayName = currentUser ? currentUser.name : "Loading"

    return (
        <div className="home">
            <Navigation currentUser={currentUser} />
            <div className="cont">
                <Row>
                    <Col xs={2}></Col>
                    <Col xs={8}>
                        <CoursesView currentUser={currentUser} username={displayName}/>
                    </Col>
                    <Col xs={2}></Col>
                </Row>
            </div>
            <PostViewer/>
        </div>
    )
};

export default Home;