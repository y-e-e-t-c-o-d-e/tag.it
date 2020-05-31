import React from 'react';
import './style.css';

const PostGrid = (props) =>{
    return(
        <div className="post-grid">
            <div className="postview-center">
                <a href={props.link}> {props.title} </a>
            </div>
        </div>
    );
}

export default PostGrid;