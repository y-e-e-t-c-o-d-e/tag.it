import React from 'react'
import './style.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import PostEditor from "../PostEditor/index.jsx";

class PostCreator extends React.Component {
    render() {
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
                <DropdownButton id="dropdown-button-privacy" title="public, visible" drop="up">
                    <Dropdown.Item as="button">public, visible</Dropdown.Item>
                    <Dropdown.Item as="button">public, anonymous</Dropdown.Item>
                    <Dropdown.Item as="button">private</Dropdown.Item>
                </DropdownButton>
            </div>
        );
    }
}

export default PostCreator;