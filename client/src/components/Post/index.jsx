/*Post defines the component that displays a single
question, poster/user, post content, and followup to a
user who has selected a question*/

import React from 'react';
import './style.css';
import PostList from '../PostList';

class Post extends React.Component {
    /*state = {
        isList: false,
    }*/

    /*goTo = () => {
        return (
            this.setState({isList:true})
        );
    }*/

    goBack = () => {
        return (
        <button className="back" onClick={() => this.goTo()}>
            <h5>
                back
            </h5>
        </button>
        );
    }

    doSmth = () => {
        return (
        <h1>hello</h1>
    );
    }

    render() {
        return (
            <div className="post">
                {this.goBack()}
                {this.doSmth()}
            </div>
        );
    }
}

// todo: add these functions to component and write their bodies
/*question = (props) => {
    return (
        <div className="question">
            <h2>How do you answer a question?</h2>
        </div>
    );
}

user = (props) => {
    return (
    <div></div>
    );
}

content = (props) => {
    return (
        <div className="content">
            <h3>What the question asks ^^</h3>
        </div>
    );
}

actionBar = (props) => {
    return (
        <div>
            
        </div>
    );
}

discussion = (props) => {
    return (
        <div>
            
        </div>
    );
}
*/
export default Post;