import React from "react";
import PostGrid from '../PostGrid';
import './style.css';

const QuestionList = ({ questions, courseId, history, filters }) =>{

    // Sorts the posts by pinned first then reverse chronological order
    const orderedPosts = questions.sort((post1, post2) =>{
        if(post1.isPinned && !post2.isPinned){return -1;}
        else if(!post1.isPinned && post2.isPinned){return 1;}
        else if(post1.uuid > post2.uuid){return -1;}
        else if(post2.uuid > post1.postUUID){return 1;}
        return 0;
    }).filter(post => {
        // post.tagList compare to filters.tags
        const filterTags = filters.tags.map(tag => tag.uuid)
        return post.title.toLowerCase().includes(filters.search.toLowerCase()) && (filterTags.length === 0 || filterTags.some(item => post.tagList.includes(item)))
    });


    // Displays all posts that are not private
    const listBody = orderedPosts.map((post, key) =>{
        let link = "/courses/"+ courseId+ "/posts/"+post.uuid;

        return (    
            <PostGrid key={key} title={post.title} history={history} link={link} isPrivate={post.isPrivate}/>
        )
    })

    // Indicates that there are no posts for this class yet
    const emptyPost = (
        <div>
            Click make.it to create the first post of the class!
        </div>
    );

    // Renders the components depending on whether the class has posts yet
    let content = questions.length? listBody:emptyPost;

    return(
        <div className="qList">
            {content}            
        </div>
    );
};

export default QuestionList;