import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom"
import './style.css';
import db from "../../base";
import Navigation from "../../components/Navbar";
import TagList from "../../components/TagList/index.jsx";
import { Container, Row, Col, Nav, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import CoursesView from '../../components/CoursesView/index.jsx';
import CommentSection from "../../components/CommentSection"
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

    // A list of all the tags to be rendered
    const tagButtons = post.tagList.map((tag)=>{
        return(<Button variant="primary" block key={tag.uuid} className="tagListItem"><b>{tag}</b></Button>);
    });

    // Toggles the following status of the post
    const toggleFollow = () =>{
        API.toggleFollow(currentUser, postId);
    }

    // Render corresponding button depending on the current following state;
    let followUnfollowButton;
    if(currentUser){
        let followUnfollow = (
                currentUser.followingList.includes(postId)?
                <Dropdown.Item key="unfollow" as="button" onClick={toggleFollow}>Unfollow</Dropdown.Item>:
                <Dropdown.Item key="follow" as="button" onClick={toggleFollow}>Follow Post</Dropdown.Item>
        );
        followUnfollowButton = followUnfollow;
    }else{
        followUnfollowButton = (<Dropdown.Item key="follow" as="button">Loading </Dropdown.Item>);
    }
    
    // Copy link on click of the copy button
    const copyLink = () =>{
        let link = `tagdotit.netlify.com/course/${courseId}/post/${postId}`;
        navigator.clipboard.writeText(link);
        alert("Link successfully copied!");
    }

    // Render resolve button depending on the current resolved state;
    let resolveUnresolveButton;
    resolveUnresolveButton = ( post.isResolved?
        <Dropdown.Item key="resolve" as="button">Resolve</Dropdown.Item>:
        <Dropdown.Item key="resolve" as="button">Resolve</Dropdown.Item>
    );

    // Render like button depending on the current liked state
    let likeUnlikePostButton;
    if(currentUser){
        let likeUnlike = (
            currentUser.likedPostList.includes(postId)?
            <Button className="yellow-button">unlike</Button>:
            <Button className="yellow-button">like.it</Button>
        );
        likeUnlikePostButton=likeUnlike;
    }

    // discuss.it functionalities
    const[discussing, setDiscussing] = useState(false);
    const toggleDiscussing = () =>{
        setDiscussing(!discussing);
    }
    let discussText = (discussing? "cancel":"discuss.it");

    // Returns the content of the page
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
                            {/* Section with post title and change / actions */}
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
                                        {followUnfollowButton}
                                        <Dropdown.Item key="copy-link" as="button" onClick={copyLink}>Copy Link</Dropdown.Item>
                                        {resolveUnresolveButton}
                                    </DropdownButton>
                                </div>
                            </div>

                            {/* Post content with footer saying posted by */}
                            <div className="post-content-section">
                                <ReactMarkdown className="post-content-view" source={post.content} />
                                <div className="posted-by">Posted by: {post.author}</div>
                            </div>

                            {/* Like / discuss/ tags */}
                            <span>Tags:</span>
                            <div className="tagButtons">
                                {tagButtons}
                            </div>
                            <div className="post-view-buttons">
                                    <div className="like-discuss">
                                        
                                        <div className="likes"> {post.score} </div>
                                        {likeUnlikePostButton}
                                        <br/>
                                    </div>
                            </div>
                            <CommentSection commentList={post.commentList} postId={postId}/>

                        </div>
                    </Col>
                </Row>
            </div>
            <h1></h1>
        </div>
    )

};

export default PostView;