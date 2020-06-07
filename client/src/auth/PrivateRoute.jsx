import React, { useContext, useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import logo from "../assets/logo.png"
import API from '../utils/API';
import db from "../base";
import { createToast } from "../utils";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
    const { currentUser, pending } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Declares new function in order to utilize asynchronous features. 
        const getUser = async () => {
            try {
                let user = await API.getUser(currentUser.uid);
    
                // Handles creation of user object when object is not created but auth has already been set 
                if (!user.data) {
                    await API.createUser(currentUser.displayName ? currentUser.displayName : "Testing User", 
                                 currentUser.email,
                                 currentUser.uid);
                    user = await API.getUser(currentUser.uid);
                }
                setUserData(user.data);
            } catch (error) {
                createToast("Heroku Server is Restarting... Check back in 1 minute");
                db.auth().signOut();
            }
        }

        // Checks whether user has been verified 
        if (!!currentUser) {
            // Gets the User data if user is signed in
            getUser();
        }
    }, [currentUser, window.location.pathname === 1]);

    // If Firebase is still fetching the current user, render the loading state. 
    if (pending) {
        return (
            <div className="container h-100">
                <div className="row align-items-center h-100">
                    <div className="col-6 mx-auto">
                            <img src={logo}/>
                    </div>
                </div>
            </div>
        )  
    }

    return (
        <Route
            {...rest}
            render={routeProps =>
                !!currentUser ? (
                    <RouteComponent {...routeProps} currentUser={userData}/>
                ) : (
                        <Redirect to={{
                            pathname: '/login',
                        }}/>
                    )
            }
        />
    );
};

export default PrivateRoute;