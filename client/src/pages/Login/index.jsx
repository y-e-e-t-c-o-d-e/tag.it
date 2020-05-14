import React, { useContext } from 'react';
import { Redirect } from "react-router-dom";
import { AuthContext } from "../../auth/Auth";
import db from "../../base";
import logo from "../../assets/logo.png";
import './style.css';

const Login = ({ history }) => {
    const redirectSignUp = () => {
        history.push("/signup")
    }

    const handleLogin = (event) => {

        event.preventDefault();
        const { email, password } = event.target.elements;

        try {
            db
                .auth()
                .signInWithEmailAndPassword(email.value,
                    password.value);
            history.push("/");
        } catch (error) {
            alert(error);
        }
    }

    const { currentUser } = useContext(AuthContext);
    if (currentUser) {
        return <Redirect to="/" />;
    }

    return (
        <div>
            <div className="header">
                <img src={logo} alt="Tag.it" height="50" />
            </div>
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
                                <input name="email" type="email" placeholder="Email" />
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