import React from 'react';
import './style.css';

const privateStyle = {border: "solid 4px", backgroundColor: "#1D7B99AA"};

const PostGrid = (props) =>{
    return(
        <div className="post-grid" style={!!props.isPrivate ? privateStyle : {}}>
            <div className="postview-center">
                <a onClick={() => {props.history.push(props.link)}} href="javascript:;"> {props.title} </a>
            </div>
        </div>
    );
}

export default PostGrid;