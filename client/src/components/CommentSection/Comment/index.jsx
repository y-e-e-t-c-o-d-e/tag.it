import React, { useState } from 'react';
import "./style.css";

/* recursive functional component for comments */
const Comment = ({ comment }) => {
    const renderNestedComments = () => {
        const nestedComments = comment.childList.slice().sort((a, b) => b.time - a.time);

        return nestedComments.map(comment => {
            return <Comment key={comment.uuid} comment={comment} type="child" />
        });
    };

    return (
        <div style={{ "marginLeft": "25px", "marginTop": "10px" }}>
            <span id="username">{comment.author}</span>
            <span id="date">{comment.time.toString()}</span>
            <div>{comment.content}</div>
            {renderNestedComments()}
        </div>
    );
};

export default Comment;