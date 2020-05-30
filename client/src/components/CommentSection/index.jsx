import React, { useState } from 'react';
import "./style.css";
import Comment from "./Comment/index.jsx";

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

    const handleCreateComment = () => {
        // TODO: handle submit logic for adding post comment to commentList
    };

    const renderCreateNewComment = () => {
        if (newComment) {
            return (
                <div className="post-comment-form">
                    <form onSubmit={handleCreateComment}>
                        <textarea name="new-comment" placeholder="Create a new followup comment"></textarea>
                        <div className="comment-options">
                            <div className="select-anonymous">
                                <p>Discuss as: </p>
                                <select name="anon-type">
                                    <option value="true">Anonymous to everyone</option>
                                    <option value="false">Public to everyone</option>
                                </select>
                            </div>
                            <div className="comment-buttons">
                                <button onClick={setNewComment(false)}>Cancel</button>
                                <button type="submit">create.it</button>
                            </div>
                        </div>
                    </form>
                </div>
            );
        }
        return (
            <div className="create-new-comment">
                <button onClick={setNewComment(true)}>Create a new comment</button>
            </div>
        );
    };

    return (
        <div className="comment-section">
            <h2>Followup:</h2>
            {renderCreateNewComment}
            <div className="comment-list">
                {renderComments()}
            </div>
        </div>
    );
};

export default CommentSection;