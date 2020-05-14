import React, { useContext, useEffect, useState } from 'react';
import Button from '../../components/Button';
import './style.css';
import db from "../../base";
import { AuthContext } from '../../auth/Auth';
import API from '../../utils/API';

const Home = () => {
    const { currentUser } = useContext(AuthContext);
    
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            let user = await API.getUser(currentUser.uid);

            // Handles creation of user object when object is not created but auth has already been set 
            if (!user.data) {
                await API.createUser(currentUser.displayName ? currentUser.displayName : "Testing User", 
                             currentUser.email,
                             currentUser.uid);
                user = await API.getUser(currentUser.uid);
            }
            setUserData(user.data);
        }
        getUser();
    }, [currentUser]);

    return (
        <div className="home">
            { // TODO: Will rearrange frontend to handle the user data.
                userData ? <p>{userData.name}</p> : <></>
            }
            <h1>Tag.it</h1>
            <Button text="Click Me"></Button>
            <button onClick={() => db.auth().signOut()}>Sign Out</button>
        </div>
    )
};

export default Home;