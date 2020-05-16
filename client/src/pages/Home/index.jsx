import React from 'react';
import Button from '../../components/Button';
import './style.css';
import db from "../../base";
import PostList from '../../components/PostList';
import Post from '../../components/Post';

const Home = ({currentUser, ...rest}) => {    
    return (
        <div className="home">
            { // TODO: Will rearrange frontend to handle the user data.
                currentUser ? <p>{currentUser.name}</p> : <></>
            }
            <h1>Tag.it</h1>

            <PostList />

            <Button text="Click Me"></Button>
            <button onClick={() => db.auth().signOut()}>Sign Out</button>
        </div>
    )
};

export default Home;