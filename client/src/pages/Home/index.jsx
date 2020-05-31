import React from 'react';
import { useParams } from "react-router-dom"
import Button from "../../components/Button/index.jsx";
import './style.css';
import Navigation from "../../components/Navbar";
import TagList from "../../components/TagList/index.jsx";
import { Row, Col, Nav } from 'react-bootstrap';
import CoursesView from '../../components/CoursesView/index.jsx';

const Home = ({currentUser}) => { 
    const displayName = currentUser ? currentUser.name : "Loading"
    const { courseId } = useParams();

    return (
        <div className="home">
            <Navigation currentUser={currentUser} courseId={courseId} />
            <div className="cont">
                <Row>
                    <Col xs={2}></Col>
                    <Col xs={8}>
                        <CoursesView currentUser={currentUser} username={displayName}/>
                    </Col>
                    <Col xs={2}></Col>
                </Row>
            </div>
        </div>
    )

};

export default Home;