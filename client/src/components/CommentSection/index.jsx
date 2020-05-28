import React, { useState } from 'react';
import "./style.css";
import Comment from "./Comment/index.jsx";

// props will contain Post.commentList, list of Comment objects
const CommentSection = ({ commentList }) => {

    const renderComments = () => {
        // sort comments by most recent using time property
        const comments = commentList.slice().sort((a, b) => b.time - a.time);

        return comments.map((comment) => {
            return (
                <Comment key={comment.uuid} comment={comment} />
            );
        });
    }

    return (
        <div className="comment-section">
            <h2>Followup:</h2>
            {renderComments()}
        </div>
    );
};

export default CommentSection;