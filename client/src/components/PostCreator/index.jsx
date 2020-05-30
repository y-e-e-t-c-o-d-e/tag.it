import React from 'react'
import './style.css';
import { Dropdown, DropdownButton, Button } from 'react-bootstrap';
import PostEditor from "../PostEditor";

const PostCreator = ({}) => {

    return (
        <div className="post-creator">
            <h3>What is your question?</h3>
            <div className="question">
                <PostEditor />
            </div>
            <h3>Please enter a description:</h3>
            <div className="description">
                <PostEditor />
            </div>
            <div className="post-buttons">
                <h3>Post as:</h3>
                <DropdownButton id="dropdown-button-privacy" title="public, visible" drop="up">
                    <Dropdown.Item as="button">public, visible</Dropdown.Item>
                    <Dropdown.Item as="button">public, anonymous</Dropdown.Item>
                    <Dropdown.Item as="button">private</Dropdown.Item>
                </DropdownButton>
                <DropdownButton id="dropdown-button-tags" title="tag.it" drop="up">

                </DropdownButton>
                <Button id="create-button">create.it</Button>
            </div>
        </div>
    );
}

export default PostCreator;