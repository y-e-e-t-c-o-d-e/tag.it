import React from 'react';
import Button from "../../components/Button/index.jsx";
import './style.css';
import db from "../../base";
import Navigation from "../../components/Navbar";
import TagList from "../../components/TagList/index.jsx";
import CommentSection from "../../components/CommentSection/index.jsx";
import PostCreator from "../../components/PostCreator/index.jsx";
import { Row, Col, Nav } from 'react-bootstrap';

const Home = ({ currentUser, match }) => {
    if (match) {
        const courseId = match.params.id;
    }

    // testing purposes
    const comments = [
        {
            author: "you",
            uuid: 1,
            time: new Date('December 17, 1995 03:24:00'),
            content: "this is a dummy comment",
            childList: [
                {
                    author: "me",
                    uuid: 2,
                    time: new Date('January 10, 2000 04:20:00'),
                    content: "this is a reply",
                    childList: [
                        {
                            author: "you",
                            uuid: 3,
                            time: new Date('September 20, 2015 04:00:00'),
                            content: "no u",
                            childList: []
                        }
                    ]
                },
                {
                    author: "them",
                    uuid: 4,
                    time: new Date('October 31, 2010 01:00:00'),
                    content: "this is another reply",
                    childList: []
                }
            ]
        },
        {
            author: "they",
            uuid: 5,
            time: new Date('December 17, 1995 05:23:00'),
            content: "you are a dummy",
            childList: []
        }
    ];

    return (
        <div className="home">
            <Navigation />
            <div className="cont">
                <Row>
                    <Col xs={4}>
                        <TagList />
                    </Col>
                    <Col>
                        <PostCreator />
                    </Col>
                </Row>
            </div>
            <CommentSection commentList={comments} />
        </div>
    )
};

export default Home;