import React, {useState, useEffect} from 'react';
import { Form, Button } from "react-bootstrap";
import { API, MarkdownEditor } from '../../utils';
import './style.css';

// TODO: Grab text from backend route & set better styling. Add Submit Button. Add HTML parsing.
const EditPost = ({postText}) => {
    const[postContent, setPostContent] = useState(postText);

    useEffect(()=>{setPostContent(postText)},[]);

    return (
        <div className="edit-post">
            <h1>Edit Post</h1>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Description</Form.Label>
                <Form.Control defaultValue={postContent} as="textarea" rows="5" onChange={(e) => setPostContent(e.target.value)}/>
                <Button className = "save-changes" type="submit">Save</Button>
            </Form.Group> 
            <p>Preview</p>
            <MarkdownEditor className="liveView" source={postContent} />
        </div>
    )
}

export default EditPost;