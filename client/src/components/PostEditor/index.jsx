import React, {useState, useEffect} from 'react';
import { Form } from "react-bootstrap";
import { API, MarkdownEditor } from '../../utils';
import './style.css';

// TODO: Grab text from backend route & set better styling. Add Submit Button. Add HTML parsing.
const PostEditor = ({postText, setPostText}) => {
    return (
        <div className="postEditor">
            <MarkdownEditor className="liveView" source={postText} />
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Description</Form.Label>
                <Form.Control defaultValue={postText} as="textarea" rows="5" onChange={(e) => setPostText(e.target.value)}/>
            </Form.Group> 
        </div>
    )
}

export default PostEditor;