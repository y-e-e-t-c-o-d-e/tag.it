import React, { useState } from 'react';
import "./style.css";

import Comment from "./Comment/index.jsx";
import API from "../../utils/API.js"

// Post.commentList should be passed in, list of Comment objects
const CommentSection = ({ commentList }) => {

    const [newComment, setNewComment] = useState(false);

    const renderComments = () => {
        // sort comments by most recent using time property
        const comments = commentList.slice().sort((a, b) => b.time - a.time);

        return comments.map((comment) => {
            return (
                <Comment key={comment.uuid} comment={comment} />
            );
        });
    };

    const handleCreateComment = (e) => {
        // TODO: handle submit logic for adding post comment to commentList
        e.preventDefault();
        const TEXT_AREA_IDX = 0, SELECT_IDX = 1;
        const commentContent = e.target.elements[TEXT_AREA_IDX].value;
        const visibility = e.target.elements[SELECT_IDX].value;

        API.createComment(commentContent, visibility);
    };

    const renderCreateNewComment = () => {
        if (newComment) {
            return (
                <div>
                    <form onSubmit={handleCreateComment} className="post-comment-form">
                        <div className="comment-text">
                            <textarea name="new-comment" placeholder="Create a new followup comment"></textarea>
                        </div>
                        <div className="comment-options">
                            <div className="select-anonymous">
                                <p>Discuss as: </p>
                                <div className="select-type">
                                    <select name="anon-type">
                                        <option value="anon">Anonymous to everyone</option>
                                        <option value="public">Public to everyone</option>
                                    </select>
                                </div>
                            </div>
                            <div className="comment-buttons">
                                <button onClick={() => { setNewComment(false) }}>Cancel</button>
                                <button type="submit">create.it</button>
                            </div>
                        </div>
                    </form>
                </div>
            );
        }
        return (
            <div className="comment-buttons new-comment-button">
                <button onClick={() => { setNewComment(true) }}>Create a new comment</button>
            </div>
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