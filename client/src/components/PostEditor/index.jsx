import React, {useState} from 'react';
import ReactMarkdown from 'react-markdown';
import './style.css';
import Button from '../Button';

// TODO: Grab text from backend route & set better styling. Add Submit Button. Add HTML parsing.
const PostEditor = (props) => {
    const [postText, setPostText] = useState("# This is a header");

    return (
        <div className="postEditor">
            <ReactMarkdown className="liveView" source={postText} />
            <textarea className="editor" 
                cols="200"
                rows="20"
                onChange={(e) => setPostText(e.target.value)}>
                {postText}    
            </textarea>
        </div>
    )
}

export default PostEditor;