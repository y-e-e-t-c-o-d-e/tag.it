import React from 'react';
import Button from "../../components/Button/index.jsx";
import './style.css';
import db from "../../base";
import TagList from "../../components/TagList/index.jsx";

const Home = ({ currentUser, ...rest }) => {
    const redirectClassCreation = () => {
        history.push("/createclass");
    }

    return (
        <div className="home">
            { // TODO: Will rearrange frontend to handle the user data.
                currentUser ? <p>{currentUser.name}</p> : <></>
            }
            <h1>Tag.it</h1>
            <button onClick={redirectClassCreation}>Create a Class</button>
            <button onClick={() => db.auth().signOut()}>Sign Out</button>
            <TagList />
        </div>
    )
};

export default Home;