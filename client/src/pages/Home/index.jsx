import React from 'react';
import Button from "../../components/Button/index.jsx";
import './style.css';
import db from "../../base";
import Navigation from "../../components/Navbar";
import TagList from "../../components/TagList/index.jsx";
import PostCreator from "../../components/PostCreator/index.jsx";
import QuestionList from "../../components/QuestionList/index";
import { Row, Col, Nav } from 'react-bootstrap';

const Home = ({currentUser, match}) => { 
    if (match) {
        const courseId = match.params.id;
    }

    return (
        <div className="home">
            <Navigation/>
            <div className="cont">
            <Row>
                <Col xs={4}>
                    <TagList />
                </Col>
                <Col>
                    <PostCreator/>
                </Col>
            </Row>
            </div>
            <QuestionList/>
        </div>
    )

};

export default Home;