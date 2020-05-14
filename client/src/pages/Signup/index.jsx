import React from "react";
import db from "../../base";
import './style.css';
import logo from '../../assets/logo.png';

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
            <div className="centered">
                <div className="contents">
                    {/* The tag.it logo*/}
                    <div id="center-logo">
                        <img src={logo} alt="Tag.it" height="125" />
                        <h2>Connecting Students to Professors</h2>
                    </div>
                    <div className="input-row">
                        <div className="input">
                            <h1>Sign Up</h1>
                            <form onSubmit={handleSignUp}>
                                <label>
                                    <p>Please enter your email: </p>
                                    <input name="email" type="email" placeholder="Email" />
                                </label>
                                <br />
                                <label>
                                    <p>Please enter your password: </p>
                                    <input name="password" type="password" placeholder="Password" />
                                </label>
                                <label>
                                    <p>Please enter your password again: </p>
                                    <input name="password" type="password" placeholder="Password" />
                                </label>
                                <br /> <br />
                                <button type="submit">Sign Up</button>
                            </form>
                        </div>

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