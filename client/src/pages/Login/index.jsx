import React, { useState, useContext } from 'react';
import { Redirect } from "react-router-dom";
import { Button, Form } from "react-bootstrap"
import { AuthContext } from "../../auth";
import { Navigation } from "../../components";
import db from "../../base";
import { createToast } from '../../utils';
import logo from "../../assets/logo.png";
import './style.css';

const bgColors = {
    "default": "white",
    "error": "#ffcccc",
};

const Login = ({ history }) => {
    const redirectSignUp = () => {
        history.push("/signup")
    }

    const handleLogin = async (event) => {
        event.preventDefault();
        const { email, password } = event.target.elements;

        try {
            // This action will cause the onChangeEventListener to occur (in Auth.jsx)
            const { user } = await db
                .auth()
                .signInWithEmailAndPassword(email.value,
                    password.value);

            // Only reroutes to new page if user's email is verified
            if (user.emailVerified) {
                history.push("/");
            }
        } catch (error) {
            createToast(error);
        }
    }

    const { currentUser } = useContext(AuthContext);
    if (currentUser) {
        return <Redirect to="/" />;
    }

    return (
        <div>
            <Navigation history={history} />
            <div className="container">
                <div id="center-logo">
                    <img src={logo} alt="Tag.it" height="125" />
                    <p>Connecting Students to Professors</p>
                </div>
                <div className="input-row">
                    <div className="input">
                        <h2>Log In</h2>
                        <Form onSubmit={handleLogin}>
                            <div className="inputField">
                                <Form.Label>Email</Form.Label>
                                <Form.Control name="email" type="email" placeholder="Email"
                                    style={{ backgroundColor: "white" }}
                                />
                            </div>

                            <div className="inputField">
                                <Form.Label>Password</Form.Label>
                                <Form.Control name="password" type="password" placeholder="Password" />
                                <a href="/" id="pwdRecover">Forgot your password?</a>
                            </div>

                            <Button type="submit">Log In</Button>
                        </Form>
                    </div>
                    <div className="input">
                        <h3>Don't have an account?</h3>
                        <Button onClick={redirectSignUp}>Sign Up</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;