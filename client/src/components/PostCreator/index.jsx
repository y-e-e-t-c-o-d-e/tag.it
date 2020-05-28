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
                <DropdownButton id="dropdown-item-button" title="Dropdown button" drop="up">
                    <Dropdown.Item as="button">Action</Dropdown.Item>
                    <Dropdown.Item as="button">Another action</Dropdown.Item>
                    <Dropdown.Item as="button">Something else</Dropdown.Item>
                </DropdownButton>
            </div>
        );
    }
}

export default PostCreator;