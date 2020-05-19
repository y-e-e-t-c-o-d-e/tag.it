import React, { useState, useContext } from 'react';
import { Redirect } from "react-router-dom";
import { AuthContext } from "../../auth/Auth";
import db from "../../base";
import LoginNav from "../../components/LoginNav";
import logo from "../../assets/logo.png";
import './style.css';

var bgColors = {
    "default": "white",
    "error": "#ffcccc",
};


var actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be whitelisted in the Firebase Console.
    url: 'https://tagdotit.netlify.app',
    // This must be true.
    handleCodeInApp: true,
    iOS: {
        bundleId: 'com.example.ios'
    },
    android: {
        packageName: 'com.example.android',
        installApp: true,
        minimumVersion: '12'
    },
    dynamicLinkDomain: 'example.page.link'
};


const Login = ({ history }) => {
    const redirectSignUp = () => {
        history.push("/signup")
    }

    /* Checks whether the input form is valid */
    const [emailValid, setEmailValid] = useState(false);

    const sendLink = async (event) => {
        if (emailValid) {
            event.preventDefault();
            console.log('hi')
            const { email } = event.target.elements;
            console.log(email.value)
            db.auth().sendSignInLinkToEmail(email.value, actionCodeSettings)
                .then(function () {
                    // The link was successfully sent. Inform the user.
                    // Save the email locally so you don't need to ask the user for it again
                    // if they open the link on the same device.
                    window.alert('A login email was sent!');
                    window.localStorage.setItem('emailForSignIn', email.value);
                })
                .catch(function (error) {
                    // Some error occurred, you can inspect the code: error.code
                    window.alert(error.message)
                });
        }
        else { alert("Invalid email address"); }
    }

    const confirmSignIn = () => {
        // Confirm the link is a sign-in with email link.
        if (db.auth().isSignInWithEmailLink(window.location.href)) {
            // Additional state parameters can also be passed via URL.
            // This can be used to continue the user's intended action before triggering
            // the sign-in operation.
            // Get the email if available. This should be available if the user completes
            // the flow on the same device where they started it.
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                // User opened the link on a different device. To prevent session fixation
                // attacks, ask the user to provide the associated email again. For example:
                email = window.prompt('Please provide your email for confirmation');
            }
            // The client SDK will parse the code from the link for you.
            db.auth().signInWithEmailLink(email, window.location.href)
                .then(function (result) {
                    // Clear email from storage.
                    window.localStorage.removeItem('emailForSignIn');
                    // You can access the new user via result.user
                    // Additional user info profile not available via:
                    // result.additionalUserInfo.profile == null
                    // You can check if the user is new or existing:
                    // result.additionalUserInfo.isNewUser
                })
                .catch(function (error) {
                    // Some error occurred, you can inspect the code: error.code
                    // Common errors could be invalid email and invalid or expired OTPs.
                    window.alert(error.message)
                });
        }
    }

    /* Makes possible email input background color change  */
    const [emailBgColor, setEmailBgColor] = useState(
        bgColors.default
    );

    /* When input for email address changes, try to validate the email address */
    const handleEmailChange = (event) => {
        const emailInput = event.target.value;
        let lastAtPos = emailInput.lastIndexOf('@');
        let lastDotPos = emailInput.lastIndexOf('.');

        // Logics used to check validity of email input
        let validFormat = lastAtPos > 0 && lastDotPos > 2 && lastAtPos < lastDotPos;
        let containsDoubleAt = emailInput.lastIndexOf('@@') !== -1;
        let validOrgNameLength = emailInput.length - lastDotPos > 2;

        // If any of the logics are not satisfied, change the background color to red
        if (emailInput === "" || !validFormat || !validOrgNameLength || containsDoubleAt) {
            setEmailBgColor(bgColors.error);
            setEmailValid(false);
        }

        // Otherwise, set the background color as light blue (to indicate correctness)
        else {
            setEmailBgColor(bgColors.default);
            setEmailValid(true);
        }
    }

    const { currentUser } = useContext(AuthContext);
    if (currentUser) {
        return <Redirect to="/" />;
    }

    return (
        <div>
            <LoginNav />
            <div className="container">
                <div id="center-logo">
                    <img src={logo} alt="Tag.it" height="125" />
                    <h2>Connecting Students to Professors</h2>
                </div>
                <div className="input-row">
                    <div className="input">
                        <h2>Log In</h2>
                        <form onSubmit={sendLink}>
                            <div className="inputField">
                                <label>Email</label>
                                <input name="email" type="email" placeholder="Email"
                                    onBlur={handleEmailChange}
                                    style={{ backgroundColor: emailBgColor }}
                                />
                            </div>

                            <div className="inputField">
                                <label>Password</label>
                                <input name="password" type="password" placeholder="Password" />
                                <a href="/" id="pwdRecover">Forgot your password?</a>
                            </div>

                            <button type="submit">Log In</button>
                        </form>
                    </div>
                    <div className="input">
                        <h3>Don't have an account?</h3>
                        <button onClick={redirectSignUp}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;