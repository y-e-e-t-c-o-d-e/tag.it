import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom"
import './style.css';
import db from "../../base";
import Navigation from "../../components/Navbar";
import TagList from "../../components/TagList/index.jsx";
import { Row, Col, Nav, Button } from 'react-bootstrap';
import CoursesView from '../../components/CoursesView/index.jsx';
import QuestionList from "../../components/QuestionList"
import PostCreator from "../../components/PostCreator"
import { API, createToast } from '../../utils';
import PostEditor from '../../components/PostEditor';
import ReactMarkdown from 'react-markdown';

const PostView = ({currentUser, match}) => { 
    const { postId, courseId } = useParams();

    const [post, setPost] = useState({
        title: "Test Title",
        content: "Hey this is a Body of the Post!",
        author: "userUUID here",
        tagList: ["some tag id", "some tag id"],
        commentList: ["some comment id", "some comment id"],
        followingList: ["some user id", "some user"],
        isAnnouncement: false,
        isPinned: false,
        isResolved: false,
        isPrivate: false,
        isAnonymous: false,
        score: 12,
        isInstructor: false,
    })

    useEffect(() => {
        API.getPost(postId).then((response) => {
            setPost(response.data)
        }).catch(err => {
            createToast("an error occurred")
        })
    }, [])

    const [tags, setTags] = useState([])

    useEffect(() => {
        API.getCourse(courseId).then(response => {
            setTags(response.data.tagList)
        }).catch(err => {
        })
    }, [])

    return (
        <div className="home">
            <Navigation currentUser={currentUser} />
            <div className="cont">
                <Button href={`/courses/${courseId}`}>Course Home</Button>
            <Row>
                <Col xs={4}>
                    <TagList tags={tags} />
                </Col>
                <Col>
                    <Row>
                        <Col xs={8}><h1>{post.title}</h1></Col>
                    </Row>

                    <ReactMarkdown className="liveView" source={post.content} />
                </Col>
            </Row>
            </div>
            <h1></h1>
        </div>
    )

};

export default PostView;