import React, { useContext, useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import API from '../utils/API';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
    const { currentUser, pending } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Declares new function in order to utilize asynchronous features. 
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

        // Checks whether user has been verified 
        if (!!currentUser) {
            // Gets the User data if user is signed in
            getUser();
        }
    }, [currentUser]);

    // If Firebase is still fetching the current user, render the loading state. 
    if (pending) {
        return <h1>waiting to fetch user</h1>         
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