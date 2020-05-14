import React, { useState } from "react";
import db from "../../base";
import './style.css';
import logo from '../../assets/logo.png';

var bgColors = {
    "default": "white",
    "error": "#ffcccc",
};

const SignUp = ({ history }) => {

    /* Function to redirect to Login page */
    const redirectLogIn = () => {
        history.push("/")
    }

    /* Checks whether the input form is valid */
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);

    /* Pushes signup data to database and redirect to Login */
    const handleSignUp = (event) => {
        if (emailValid && passwordValid) {
            event.preventDefault();
            const { email, password } = event.target.elements;

            try {
                db
                    .auth()
                    .createUserWithEmailAndPassword(email.value,
                        password.value);
                history.push("/");
            } catch (error) {
                alert(error);
            }
        }
        else{
            if(!emailValid){alert("Invalid email address");}
            else if(!passwordValid){alert("Passwords do not match");}
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

    /* Makes possible password input background color change  */
    const [passwordBgColor, setPasswordBgColor] = useState(
        bgColors.default
    );

    /* Keeps track of the password inputs */
    const [firstPassword, setFirstPassword] = useState("");
    const [secondPassword, setSecondPassword] = useState("");

    /* Handles first password change */
    const handleFirstPasswordChange = (event) =>{
        const input = event.target.value;
        setFirstPassword(input);
        if(firstPassword === secondPassword){
            setPasswordBgColor(bgColors.default);
            setPasswordValid(true);
        }

        else{
            if(secondPassword !== ""){setPasswordBgColor(bgColors.error);}
            setPasswordValid(false);
        }
    }

    /* Handles second password change */
    const handleSecondPasswordChange = (event) =>{
        const input = event.target.value;
        setSecondPassword(input);
        if(firstPassword === secondPassword){
            setPasswordValid(true);
        }

        else{
            setPasswordValid(false);
        }
    }

    /* Handles second password blur */
    const handleSecondPasswordBlur = (event) =>{
        const input = event.target.value;
        setSecondPassword(input);
        if(firstPassword === secondPassword){
            setPasswordBgColor(bgColors.default);
            setPasswordValid(true);
        }

        else{
            if(firstPassword !== ""){setPasswordBgColor(bgColors.error);}
            setPasswordValid(false);
        }
    }

    return (
        <div>
            <div className="centered">
                <div className="contents">
                    {/* The tag.it logo*/}
                    <div id="center-logo">
                        <img src={logo} alt="Tag.it" height="125" />
                        <h2>Connecting Students to Professors</h2>
                    </div>

                    {/* The main body of the page */}
                    <div className="input-row">

                        {/* Signup section */}
                        <div className="input">
                            <h2>Sign Up</h2>
                            <form onSubmit={handleSignUp}>
                                <label>
                                    <p>Please enter your email: </p>
                                    <input name="email" type="email" placeholder="Email"
                                        onBlur={handleEmailChange}
                                        style={{ backgroundColor: emailBgColor }}
                                    />
                                </label>
                                <label>
                                    <p>Please enter your password: </p>
                                    <input name="password" type="password" placeholder="Password" 
                                        onChange={handleFirstPasswordChange}
                                        onBlur={handleFirstPasswordChange}
                                        style={{backgroundColor: passwordBgColor}}
                                    />
                                </label>
                                <label>
                                    <p>Please enter your password again: </p>
                                    <input name="password" type="password" placeholder="Password" 
                                        onChange={handleSecondPasswordChange}
                                        onBlur={handleSecondPasswordBlur}
                                        style={{backgroundColor: passwordBgColor}}
                                    />
                                </label>
                                <br />
                                <button type="submit" id="signup-button">Sign Up</button>
                            </form>
                        </div>

                        {/* Redirect to Log in */}
                        <div className="input">
                            <h3>Already have an account?</h3>
                            <button onClick={redirectLogIn}>Log In</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;