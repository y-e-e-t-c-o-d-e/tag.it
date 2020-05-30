import React from 'react';
import Button from "../../components/Button/index.jsx";
import './style.css';
import db from "../../base";
import Navigation from "../../components/Navbar";
import TagList from "../../components/TagList/index.jsx";
import InviteVerification from "../../pages/InviteVerification/index";

const Home = ({currentUser, match}) => { 
    if (match) {
        const courseId = match.params.id;
    }

    

    return (
        <div className="home">
            <Navigation/>
            { // TODO: Will rearrange frontend to handle the user data.
                currentUser ? <p>{currentUser.name}</p> : <></>
            }
            <h1>Tag.it</h1>
            <Button text="Click Me"></Button>
            <button onClick={() => db.auth().signOut()}>Sign Out</button>
            <TagList />
        </div>
    )
};

export default Home;