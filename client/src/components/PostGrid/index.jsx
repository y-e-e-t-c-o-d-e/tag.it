import React, {useState, useEffect} from 'react';
import './style.css';
import API from "../../utils/API";

const PostGrid = ({courseId, postId}) =>{

    const [postTitle, setPostTitle] = useState("What are common tools used in Hardware Engineering?");
    let link = "/course/"+courseId+"/post"+postId;

    useEffect(() => {
        API.getPost(postId).then((post) => {
            setPostTitle(post.mockdata.title)
        }).catch(() => {
            setPostTitle("What are common tools used in Hardware Engineering?")
        })
    }, [])

    return(
        <div className="post-grid">
            <div className="postview-center">
                <a href={link}> {postTitle} </a>
            </div>
        </div>
    );
}

export default PostGrid;