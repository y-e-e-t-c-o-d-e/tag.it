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

const Login = ({ history }) => {
    const redirectSignUp = () => {
        history.push("/signup")
    }

    /* Checks whether the input form is valid */
    const [emailValid, setEmailValid] = useState(false);

    const handleLogin = async (event) => {
        if (emailValid) {
            event.preventDefault();
            const { email, password } = event.target.elements;

            try {
                await db
                    .auth()
                    .signInWithEmailAndPassword(email.value,
                        password.value);
                history.push("/");
            } catch (error) {
                alert(error);
            }
        }
        else { alert("Invalid email address"); }
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
            <LoginNav/>
            <div className="container">
                <div id="center-logo">
                    <img src={logo} alt="Tag.it" height="125" />
                    <h2>Connecting Students to Professors</h2>
                </div>
                <div className="input-row">
                    <div className="input">
                        <h2>Log In</h2>
                        <form onSubmit={handleLogin}>
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