import React from 'react';
import Button from "../../components/Button/index.jsx";
import './style.css';
import db from "../../base";
import Navigation from "../../components/Navbar";
import TagList from "../../components/TagList/index.jsx";
import PostCreator from "../../components/PostCreator/index.jsx"

const Home = ({currentUser, ...rest}) => {
    return (
        <div className="home">
            <Navigation/>
            { // TODO: Will rearrange frontend to handle the user data.
                currentUser ? <p>{currentUser.name}</p> : <></>
            }
            <h1>Tag.it</h1>
            <TagList />
        </div>
    )
};

export default Home;