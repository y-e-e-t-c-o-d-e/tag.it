import React, {useState, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import API from '../../utils/API';
import './style.css';

// TODO: Grab text from backend route & set better styling. Add Submit Button. Add HTML parsing.
const PostEditor = (props) => {
    const [postText, setPostText] = useState("");

    useEffect(() => {
        API.getPost("some uuid").then((data) => {
            setPostText(data.data.content);
        });
    }, [])

    return (
        <div className="postEditor">
            <ReactMarkdown className="liveView" source={postText} />
            <textarea className="editor" 
                cols="200"
                rows="20"
                defaultValue={postText}
                onChange={(e) => setPostText(e.target.value)}>
            </textarea>
        </div>
    )
}

export default PostEditor;