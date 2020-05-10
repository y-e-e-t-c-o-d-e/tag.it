import React from "react";
import db from "../../base";
import './style.css';
import logo from '../../img/logoAllTransparent.png';

const SignUp = ({ history }) => {
    const redirectLogIn = () => {
        history.push("/")
    }

    const handleSignUp = (event) => {

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

    return (
        <div>
        <div className="header">
            <img id="logo" src={logo} alt="Tag.it" />
        </div>
        <div className="centered">
            <div className="contents">
                <h1>Sign Up</h1>
                <form onSubmit={handleSignUp}>
                    <label>
                        <p>Please enter your email: </p>
                        <input name="email" type="email" placeholder="Email" />
                    </label>
                    <br />
                    <label>
                        <p>Please enter your passwrod: </p>
                        <input name="password" type="password" placeholder="Password" />
                    </label>
                    <label>
                        <p>Please enter your passwrod again: </p>
                        <input name="password" type="password" placeholder="Password" />
                    </label>
                    <br />
                    <button type="submit">Sign Up</button>
                </form>
                <button onClick={redirectLogIn}>Log In</button>
            </div>
        </div>
        </div>
    );
};

export default SignUp;