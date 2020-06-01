import React, { useState, useEffect } from 'react';
import "./style.css";

import Comment from "./Comment/index.jsx";
import API from "../../utils/API.js";
import { Dropdown, DropdownButton, Button } from "react-bootstrap";
import { createToast } from '../../utils';

// Post.commentList and Post.uuid should be passed in
const CommentSection = ({ commentList, postId }) => {

    const [newComment, setNewComment] = useState(false);
    const [refreshComments, setRefreshComments] = useState(false);
    const [visibility, setVisiblity] = useState("public, visible");
    const [comments, setComments] = useState([{uuid: "loading", author: "Loading", time: Date.now(), content: "Loading", childList: []}]);

    useEffect(() => {
        API.getComments(postId)
            .then(response => {
                setComments(response.data)
            })
            .catch(error => {

            })
    }, [newComment, refreshComments])

    const renderComments = () => {
        // sort comments by most recent using time property
        // const comments = commentList.slice().sort((a, b) => b.time - a.time);
        return comments.map((comment) => {
            return (
                <Comment key={comment.uuid} comment={comment} refresh={setRefreshComments} postId={postId} />
            );
        });
    };

    const handleCreateComment = (e) => {
        // TODO: handle submit logic for adding post comment to commentList
        e.preventDefault();
        const TEXT_AREA_IDX = 0, SELECT_IDX = 1;
        const commentContent = e.target.elements[TEXT_AREA_IDX].value;
        const visibility = e.target.elements[SELECT_IDX].textContent;

        API.createComment(commentContent, visibility, null, postId).then(response => {
            createToast("comment created!")
            setNewComment(false);
            // use effect go again
        }).catch(err => {
            createToast("an error occurred")
        });
    };

    const renderCreateNewComment = () => {
        if (newComment) {
            return (
                <div>
                    <form onSubmit={handleCreateComment} className="post-comment-form">
                        <div className="comment-text">
                            <textarea name="new-comment" placeholder="Create a new followup comment"></textarea>
                        </div>
                        <div className="comment-post-options">
                            <div className="select-anonymous">
                                <p>Discuss as: </p>
                                <DropdownButton id="dropdown-button-form" title={visibility} drop="up">
                                    <Dropdown.Item onClick={() => { setVisiblity("public, visible") }} >public, visible</Dropdown.Item>
                                    <Dropdown.Item onClick={() => { setVisiblity("public, anonymous") }} >public, anonymous</Dropdown.Item>
                                    <Dropdown.Item onClick={() => { setVisiblity("private") }} >private</Dropdown.Item>
                                </DropdownButton>
                            </div>
                            <Button id="cancel-button" onClick={() => { setNewComment(false) }}>cancel</Button>
                            <Button id="create-button" type="submit">create.it</Button>
                        </div>
                    </form>
                </div>
            );
        }
        return (
            <Button id="new-comment-button" onClick={() => { setNewComment(true) }}>discuss.it</Button>
        );
    };

    return (
        <div className="comment-section">
            <h2>Followup:</h2>
            {renderCreateNewComment()}
            <div className="comment-list">
                {renderComments()}
            </div>
        </div>
    );
};

export default CommentSection;