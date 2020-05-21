import React, { useEffect, useState } from "react";
import db from "../base";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    // Pending is set in order to indicate that Firebase is currently fetching the current user. 
    const [pending, setPending] = useState(true);

    useEffect(() => {
        // Upon loading any page, this method is ALWAYS called.
        db.auth().onAuthStateChanged((user) => {
            // User is signed in 
            if (user) {
                // Sets current user only if user is signed in
                if (user.emailVerified) {
                    setCurrentUser(user);
                } else {
                    // Handles when user is signed in BUT email is not verified
                    window.alert(`Email ${user.email} needs to be verified.`);
                    db.auth().signOut();
                }
            } else {
                // User is signed out
                setCurrentUser(user);
            }
            setPending(false);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, pending }}>
            {children}
        </AuthContext.Provider>
    );
};