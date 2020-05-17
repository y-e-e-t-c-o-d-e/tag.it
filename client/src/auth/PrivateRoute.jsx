import React, { useContext, useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import API from '../utils/API';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
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
        if (!!currentUser) {
            getUser();
        }
    }, [currentUser]);

    return (
        <Route
            {...rest}
            render={routeProps =>
                !!currentUser ? (
                    <RouteComponent {...routeProps} currentUser={userData}/>
                ) : (
                        <Redirect to="/login" />
                    )
            }
        />
    );
};

export default PrivateRoute;