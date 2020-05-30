import React, { useState, useContext } from 'react';
import { Redirect } from "react-router-dom";
import { AuthContext } from "../../auth/Auth";
import db from "../../base";
import LoginNav from "../../components/LoginNav";
import logo from "../../assets/logo.png";
import './style.css';

const bgColors = {
    "default": "white",
    "error": "#ffcccc",
};

const PasswordReset = ({ history }) => {

    const resetPassword = (event) => {
        console.log(event.target.elements)
    };

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
                        <h2>Recover Your Passsword</h2>
                        <form onSubmit={resetPassword}>
                            <div className="inputField">
                                <label>Email</label>
                                <input name="email" type="email" placeholder="Email" />
                            </div>
                            <br></br>
                            <button type="submit">Send Email</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;