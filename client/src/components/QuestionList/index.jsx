import React, {useRef, useState, useEffect } from "react";
import './style.css';
import PostGrid from '../PostGrid/index';
import postData from './Questions.json';

const QuestionList = (props) =>{

    const[posts, updatePosts] = useState(postData);

    let sortedPosts = posts;

    // Sorts the posts by pinned first then reverse chronological order
    const sortDefault = () =>{
        let orderedPosts = [...posts.posts].sort((post1, post2) =>{
            if(post1.mockData.isPinned && !post2.mockData.isPinned){return -1;}
            else if(!post1.mockData.isPinned && post2.mockData.isPinned){return 1;}
            else if(post1.postUUID > post2.postUUID){return -1;}
            else if(post2.postUUID > post1.postUUID){return 1;}
            return 0;
        });

        //console.log(orderedPosts);

        updatePosts({posts: orderedPosts});
    };

    // Use the default sort method on component mount
    useEffect(() => {sortDefault()}, []);   

    // Displays all posts that are not private
    const listBody = sortedPosts.posts.map((post) =>{
        if(!post.mockData.isPrivate){console.error(post.mockData);}
        let link = "/course/"+props.courseId+ "/post/"+post.postUUID;
        console.log(link);
        
        return (
            !post.mockData.isPrivate &&
            <PostGrid title={post.mockData.title} link={link} />
        )
    })

    return(
        <div className="qList">
            {listBody}            
        </div>
    );
};

export default QuestionList;