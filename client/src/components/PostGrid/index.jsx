import React from 'react';
import './style.css';

const PostGrid = (props) =>{
    console.log(props);
    return(
        <div className="post-grid">
            <div className="postview-center">
                <a href="#" onClick={() => {props.history.push(props.link)}}> {props.title} </a>
                {props.isPrivate && <p>Private</p>}
            </div>
        </div>
    );
}

export default PostGrid;