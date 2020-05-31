import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom"
import './style.css';
import db from "../../base";
import Navigation from "../../components/Navbar";
import TagList from "../../components/TagList/index.jsx";
import { Container, Row, Col, Nav, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import CoursesView from '../../components/CoursesView/index.jsx';
import QuestionList from "../../components/QuestionList"
import PostCreator from "../../components/PostCreator"
import { API, createToast } from '../../utils';
import PostEditor from '../../components/PostEditor';
import ReactMarkdown from 'react-markdown';

const PostView = ({ currentUser, match }) => {
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

                        <div className="post-viewer">
                            <div className="post-title-section">
                                <Row>
                                    <Col xs={8}>
                                        <div className="post-title-view">
                                            {post.title}
                                        </div>
                                    </Col>
                                </Row>
                                <div className="title-button-section">
                                    <Button className="yellow-button">change.it</Button>
                                    <DropdownButton className="yellow-button" title="actions">
                                        <Dropdown.Item key="follow" as="button">Follow Post</Dropdown.Item>
                                        <Dropdown.Item key="copy-link" as="button">Copy Link</Dropdown.Item>
                                        <Dropdown.Item key="resolve" as="button">Resolve</Dropdown.Item>
                                    </DropdownButton>
                                </div>
                            </div>
                            <div className="post-content-section">
                                <ReactMarkdown className="post-content-view" source={post.content} />
                                <div className="posted-by">Posted by: {post.author}</div>
                            </div>
                            <Container className="post-view-buttons">
                                <Row>
                                    <Col xs={6} md={4}>
                                        <Row>
                                            <div className="likes">18</div>
                                            <Button className="yellow-button">like.it</Button>
                                        </Row>

                                        <Row>
                                            <Button className="yellow-button">discuss.it</Button>
                                        </Row>

                                    </Col>
                                    <Col>
                                        Hi...?
                            </Col>
                                </Row>
                            </Container>

                        </div>
                    </Col>
                </Row>
            </div>
            <h1></h1>
        </div>
    )

};

export default PostView;