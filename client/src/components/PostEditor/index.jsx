import React, {useState, useEffect} from 'react';
import { Form } from "react-bootstrap";
import ReactMarkdown from 'react-markdown';
import API from '../../utils/API';
import './style.css';

// TODO: Grab text from backend route & set better styling. Add Submit Button. Add HTML parsing.
const PostEditor = (props) => {
    const [postText, setPostText] = useState("**b**");

    return (
        <div className="postEditor">
            <ReactMarkdown className="liveView" source={postText} />
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Description</Form.Label>
                <Form.Control defaultValue={postText} as="textarea" rows="5" onChange={(e) => setPostText(e.target.value)}/>
            </Form.Group> 
        </div>
    )
}

export default PostEditor;