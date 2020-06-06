import React from 'react';
import { useParams } from "react-router-dom";
import { Row, Col, Nav } from 'react-bootstrap';
import { Button, Navigation, TagList, CoursesView, PostViewer, CommentSection } from "../../components";
import './style.css';

const Home = ({ currentUser, history, match }) => {
    const displayName = currentUser ? currentUser.name : "Loading"
    const { courseId } = useParams();

    return (
        <div className="home">
            <Navigation history={history} currentUser={currentUser} courseId={courseId} />
            <div className="cont">
                <Row>
                    <Col xs={2}></Col>
                    <Col xs={8}>
                        <CoursesView currentUser={currentUser} username={displayName} history={history} />
                    </Col>
                    <Col xs={2}></Col>
                </Row>
            </div>
        </div>
    )

};

export default Home;