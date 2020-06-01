import React, { useState } from 'react';
import "./style.css";

import API from "../../../utils/API.js";
import { Dropdown, DropdownButton, Button } from "react-bootstrap";
import { createToast } from '../../../utils';

/* recursive functional component for comments */
const Comment = ({ comment, postId, refresh, isTopLevel }) => {

    const [liked, setLike] = useState(comment.likedStatus);
    const [newReply, setNewReply] = useState(false);
    const [visibility, setVisiblity] = useState("public, visible");

    const handleCreateReply = (e) => {
        e.preventDefault();

        const TEXT_AREA_IDX = 0, SELECT_IDX = 1;
        const replyContent = e.target.elements[TEXT_AREA_IDX].value;
        const visibility = e.target.elements[SELECT_IDX].textContent;

        API.createComment(replyContent, visibility, comment.uuid, postId).then(() => {
            createToast("Comment created!")
            refresh(true);
            setNewReply(false);
        })
    };

    const formatDate = (rawDate) => {
        const date = new Date(rawDate);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    };

    const renderCreateNewReply = () => {
        if (newReply) {
            return (
                <div>
                    <form onSubmit={handleCreateReply} className="post-comment-form">
                        <div className="comment-text">
                            <textarea name="new-comment" placeholder="Reply to this comment"></textarea>
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
                            <Button id="cancel-button" onClick={() => { setNewReply(false) }}>cancel</Button>
                            <Button id="create-button" type="submit">create.it</Button>
                        </div>
                    </form>
                </div>
            );
        }
        return;
    };

    const renderNestedComments = () => {
        const nestedComments = comment.childList.slice().sort((a, b) => a.time - b.time);

        return nestedComments.map(childComment => {
            if (childComment === "dummy_child") { return <></> }
            return <Comment key={childComment.uuid} refresh={refresh} comment={childComment} postId={postId} isTopLevel={false} type="child" />
        });
    };

    // update like score
    const handleLike = (event) => {
        event.preventDefault();
        try {
            API.toggleLike(comment.uuid).then((response) => {
                comment.score = response.data.score;
                refresh(true);
                setLike(!liked);
            });
        } catch (error) {
            createToast(error);
        }
    }

    const renderLiked = () => {
        if (liked) {
            return <a href="#" onClick={handleLike} style={{fontWeight: "bold"}}>{"unlike.it"}</a>
        }
        return <a href="#" onClick={handleLike}>{"like.it"}</a>;
    };

    const commentType = isTopLevel ? "comment" : "child-comment";

    return (
        <div className={commentType}>
            <span id="username">{comment.authorName}</span>
            <span id="date">{formatDate(comment.time)}</span>
            <div>{comment.content}</div>
            <div className="comment-options">
                <span id="comment-score">({comment.score})</span>
                {renderLiked()}
                <a href="#" onClick={(e) => {
                    e.preventDefault();
                    setNewReply(true);
                }}>discuss.it</a>
            </div>
            {renderCreateNewReply()}
            {renderNestedComments()}
        </div>
    );
};

export default Comment;