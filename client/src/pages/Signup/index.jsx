import React, { useState } from "react";
import { Button } from "react-bootstrap";
import db from "../../base";
import './style.css';
import logo from '../../assets/logo.png';
import NavBar from "../../components/Navbar";
import API from "../../utils/API";

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
    const [nameValid, setnameValid] = useState(false);

    /* Pushes signup data to database and redirect to Login */
    const handleSignUp = async (event) => {
        if (nameValid && emailValid && passwordValid) {
            event.preventDefault();
            const { name, email, password } = event.target.elements;

            try {
                const {user} = await db
                    .auth()
                    .createUserWithEmailAndPassword(email.value,
                        password[0].value);
                user.updateProfile({
                    displayName: name.value
                });
                API.createUser(name.value, email.value, user.uid);
                history.push("/login");
                user.sendEmailVerification().then(
                    window.alert("Email Verification Sent!")
                );
            } catch (error) {
                alert(error);
            }
        }
        else{
            if(!nameValid){alert("Please enter your first and last name");}
            else if(!emailValid){alert("Invalid email address");}
            else if(!passwordValid){alert("Passwords do not match");}
        }
    }

    /* Makes possible email input background color change  */
    const [nameBgColor, setNameBgColor] = useState(
        bgColors.default
    );

    /* Makes sure name has the correct format */
    const handleNameChange = (event) => {

        // Checking for format of the name
        const nameInput = event.target.value;
        let lastSpacePos = nameInput.lastIndexOf(' ');
        let firstNameValid = lastSpacePos > 0;
        let lastNameValid = nameInput.length - lastSpacePos > 1;

        // If invalid, indicate an error
        if(nameInput==="" || !firstNameValid || !lastNameValid){
            setNameBgColor(bgColors.error);
            setnameValid(false);
        }

        // If valid, indicate valid
        else{
            setNameBgColor(bgColors.default);
            setnameValid(true);
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
    };

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
            <NavBar />
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
                                    <p>Please enter your name:</p>
                                    <input name="name" type="name" placeholder="First & Last Name"
                                        onBlur={handleNameChange}
                                        style={{ backgroundColor: nameBgColor }}
                                    />
                                </label>
                                <label>
                                    <p>Please enter your email:</p>
                                    <input name="email" type="email" placeholder="Email"
                                        onBlur={handleEmailChange}
                                        style={{ backgroundColor: emailBgColor }}
                                    />
                                </label>
                                <label>
                                    <p>Please enter your password:</p>
                                    <input name="password" type="password" placeholder="Password" 
                                        onChange={handleFirstPasswordChange}
                                        onBlur={handleFirstPasswordChange}
                                        style={{backgroundColor: passwordBgColor}}
                                    />
                                </label>
                                <label>
                                    <p>Please enter your password again:</p>
                                    <input name="password" type="password" placeholder="Confirm Password" 
                                        onChange={handleSecondPasswordChange}
                                        onBlur={handleSecondPasswordBlur}
                                        style={{backgroundColor: passwordBgColor}}
                                    />
                                </label>
                                <br />
                                <Button variant="primary" type="submit">Sign Up</Button>
                            </form>
                        </div>

                        {/* Redirect to Log in */}
                        <div className="input">
                            <h3>Already have an account?</h3>
                            <Button variant="primary" onClick={redirectLogIn}>Log In</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;