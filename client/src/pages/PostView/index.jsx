import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom"
import { Row, Col, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { Navigation, TagList, CommentSection, EditPost, MarkdownEditor } from "../../components";
import { API, createToast } from '../../utils';
import './style.css';

const PostView = ({ currentUser, history }) => {
    const { postId, courseId } = useParams();

    const [postLiked, setPostLike] = useState(false);

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
        filledInTags: []
    })

    // State to show if we are editing
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        API.getPost(postId).then((response) => {
            setPost(response.data)
        }).catch(err => {
            createToast("an error occurred")
        })
    }, [editing])

    const [tags, setTags] = useState([])
    useEffect(() => {
        API.getCourse(courseId).then(response => {
            setTags(response.data.tagList)
        }).catch(err => {
        })
    }, [])

    useEffect(() => {
        if (currentUser) {
            setPostLike(currentUser.likedPostList.includes(postId))
        }
    }, [currentUser])

    // A list of all the tags to be rendered
    const tagButtons = post.filledInTags.map((tag)=>{
        return(<Button variant="primary" block key={tag.uuid} className="tagListItem"><b>{tag.name}</b></Button>);
    });

    // Toggles the following status of the post
    const toggleFollow = () => {
        API.toggleFollow(currentUser, postId);
    }

    // Render corresponding button depending on the current following state;
    let followUnfollowButton;
    if (currentUser) {
        let followUnfollow = (
            currentUser.followingList.includes(postId) ?
                <Dropdown.Item key="unfollow" as="button" onClick={toggleFollow}>Unfollow</Dropdown.Item> :
                <Dropdown.Item key="follow" as="button" onClick={toggleFollow}>Follow Post</Dropdown.Item>
        );
        followUnfollowButton = followUnfollow;
    } else {
        followUnfollowButton = (<Dropdown.Item key="follow" as="button">Loading </Dropdown.Item>);
    }

    
    // Copy link on click of the copy button
    const copyLink = () => {
        let link = `tagdotit.netlify.com/course/${courseId}/post/${postId}`;
        navigator.clipboard.writeText(link);
        createToast("Link successfully copied!");
    }

    // Render resolve button depending on the current resolved state;
    let resolveUnresolveButton = (post.isResolved ?
        <Dropdown.Item key="resolve" as="button">Resolve</Dropdown.Item> :
        <Dropdown.Item key="resolve" as="button">Resolve</Dropdown.Item>
    );

    const handlePostLike = (event) => {
        event.preventDefault();
        try {
            API.togglePostLike(postId).then((response) => {
                post.score = response.data.score;
                setPostLike(!postLiked);
            });
        } catch (error) {
            createToast(error);
        }
    };

    // Render like button depending on the current liked state
    const renderPostLiked = () => {
        if (postLiked) {
            return <Button className="blue-button" onClick={handlePostLike}>unlike.it</Button>

        }
        return <Button className="yellow-button" onClick={handlePostLike}>like.it</Button>
    };


    // Attempt to edit the post
    const attemptEdit = () =>{
        if(post.author !== currentUser.uuid){
            alert("Only the post maker can edit the post");
            return -1;
        }
        setEditing(true);
    }

    /* The normal view to be rendered */
    let postViewer = (
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
                    <Button className="yellow-button" onClick={attemptEdit}>change.it</Button>
                    <DropdownButton className="yellow-button" title="actions">
                        {followUnfollowButton}
                        <Dropdown.Item key="copy-link" as="button" onClick={copyLink}>Copy Link</Dropdown.Item>
                        {resolveUnresolveButton}
                    </DropdownButton>
                </div>
            </div>

            {/* Post content with footer saying posted by */}
            <div className="post-content-section">
                <MarkdownEditor className="post-content-view" source={post.content} />
                <div className="posted-by">Posted by: {post.authorName}</div>
            </div>

            {/* Like / discuss/ tags */}
            <span>Tags:</span>
            <div className="tagButtons">
                {tagButtons}
            </div>
            <div className="post-view-buttons">
                    <div className="like-discuss">
                        
                        <div className="likes"> {post.score} </div>
                        {renderPostLiked()}
                        <br/>
                    </div>
            </div>
            <CommentSection commentList={post.commentList} postId={postId}/>

        </div>
    );

    // The edit view that will show up if we are currently editing
    const postContent = post.content;
    const editor = <EditPost postUUID={postId} postText={postContent} 
                    isResolved={post.isResolved} isPinned={post.isPinned}
                    setEditing={setEditing} />

    // The content to be shown depending on if we are editing
    let content = editing? editor:postViewer;

    // Returns the content of the page
    return (

        <div className="home">
            <Navigation  history={history} currentUser={currentUser} />
            <div className="cont">
                <Button onClick={() => { history.push(`/courses/${courseId}`) }}>Course Home</Button>
                <Row>
                    <Col xs={4}>
                        <TagList tags={tags} />
                    </Col>
                    <Col>
                        {content}
                    </Col>
                </Row>
            </div>
            <h1></h1>
        </div>
    )

};

export default PostView;