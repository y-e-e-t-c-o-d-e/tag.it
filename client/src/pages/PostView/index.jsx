import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom"
import './style.css';
import db from "../../base";
import Navigation from "../../components/Navbar";
import TagList from "../../components/TagList/index.jsx";
import { Row, Col, Nav, Button } from 'react-bootstrap';
import CoursesView from '../../components/CoursesView/index.jsx';
import CommentSection from "../../components/CommentSection"
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


    // testing purposes
    const comments = [
        {
            author: "Henry Chan",
            uuid: 1,
            time: new Date('December 17, 1995 03:24:00'),
            content: "this is a dummy comment",
            childList: [
                {
                    author: "Daniel Truong",
                    uuid: 2,
                    time: new Date('January 10, 2000 04:20:00'),
                    content: "this is a reply",
                    childList: [
                        {
                            author: "Maggie Mao",
                            uuid: 3,
                            time: new Date('September 20, 2015 04:00:00'),
                            content: "no u",
                            childList: []
                        }
                    ]
                },
                {
                    author: "Rohith Kasar",
                    uuid: 4,
                    time: new Date('October 31, 2010 01:00:00'),
                    content: "this is another reply",
                    childList: []
                }
            ]
        },
        {
            author: "Jeffrey Ho",
            uuid: 5,
            time: new Date('December 17, 1995 05:23:00'),
            content: "you are a dummy",
            childList: []
        }
    ];


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
                    <CommentSection commentList={comments} postId={183} />

                </Col>
            </Row>
            </div>
            <h1></h1>
        </div>
    )

};

export default PostView;