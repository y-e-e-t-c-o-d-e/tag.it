import React from "react";
import { Form, Button } from "react-bootstrap";
import logo from '../../assets/logo.png';
import { Navigation } from "../../components";
import db from "../../base";
import { API, createToast } from "../../utils"
import './style.css';

const bgColors = {
    "default": "white",
    "error": "#ffcccc",
};

const SignUp = ({ history }) => {

    /* Function to redirect to Login page */
    const redirectLogIn = () => {
        history.push("/")
    }

    /* Pushes signup data to database and redirect to Login */
    const handleSignUp = async (event) => {
        let nameValid = handleNameChange(event.target.elements[0].value);
        let emailValid = handleEmailChange(event.target.elements[1].value);
        let passwordValid = handlePasswordChange(event.target.elements[2].value, event.target.elements[3].value);

        if (nameValid && emailValid && passwordValid) {
            event.preventDefault();
            const { name, email, password } = event.target.elements;

            try {
                const { user } = await db
                    .auth()
                    .createUserWithEmailAndPassword(email.value,
                        password[0].value);
                user.updateProfile({
                    displayName: name.value
                });
                API.createUser(name.value, email.value, user.uid);
                history.push("/login");
                user.sendEmailVerification().then(
                    createToast("Email Verification Sent!")
                );
            } catch (error) {
                createToast(error);
            }
        }
        else {
            event.preventDefault();
            if (!nameValid) {
                createToast("Please enter your first and last name");
            }
            else if (!emailValid) {
                createToast("Invalid email address");
            }
            else if (!passwordValid) {
                createToast("Passwords do not match");
            }
        }
    }

    /* Makes sure name has the correct format */
    const handleNameChange = (name) => {
        // Checking for format of the name
        const nameInput = name;
        let lastSpacePos = nameInput.lastIndexOf(' ');
        let firstNameValid = lastSpacePos > 0;
        let lastNameValid = nameInput.length - lastSpacePos > 1;

        // If invalid, indicate an error
        if (nameInput === "" || !firstNameValid || !lastNameValid) {
            return false;
        }

        // If valid, indicate valid
        else {
            return true;
        }

    }

    /* When input for email address changes, try to validate the email address */
    const handleEmailChange = (email) => {
        const emailInput = email;
        let lastAtPos = emailInput.lastIndexOf('@');
        let lastDotPos = emailInput.lastIndexOf('.');

        // Logics used to check validity of email input
        let validFormat = lastAtPos > 0 && lastDotPos > 2 && lastAtPos < lastDotPos;
        let containsDoubleAt = emailInput.lastIndexOf('@@') !== -1;
        let validOrgNameLength = emailInput.length - lastDotPos > 2;

        // If any of the logics are not satisfied, change the background color to red
        if (emailInput === "" || !validFormat || !validOrgNameLength || containsDoubleAt) {
            return false;
        }

        // Otherwise, set the background color as light blue (to indicate correctness)
        else {
            return true;
        }
    };

    /* Handles password change */
    const handlePasswordChange = (firstPwd, secondPwd) => {
        if (firstPwd === secondPwd) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <div>
            <Navigation history={history} />
            <div className="container">
                <div className="contents">
                    {/* The tag.it logo*/}
                    <div id="center-logo">
                        <img src={logo} alt="Tag.it" height="125" />
                        <p>Connecting Students to Professors</p>
                    </div>

                    {/* The main body of the page */}
                    <div className="input-row">

                        {/* Signup section */}
                        <div className="input">
                            <h2>Sign Up</h2>
                            <Form onSubmit={handleSignUp}>
                                <div className="inputField">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control name="name" type="name" placeholder="First & Last Name" style={{ backgroundColor: "white" }}
                                    />
                                </div>
                                <div className="inputField">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control name="email" type="email" placeholder="Email" style={{ backgroundColor: "white" }}
                                    />
                                </div>
                                <div className="inputField">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control name="password" type="password" placeholder="Password" style={{ backgroundColor: "white" }}
                                    />
                                </div>
                                <div className="inputField">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control name="password" type="password" placeholder="Confirm Password" style={{ backgroundColor: "white" }}
                                    />
                                </div>
                                <br />
                                <Button variant="primary" type="submit">Sign Up</Button>
                            </Form>
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