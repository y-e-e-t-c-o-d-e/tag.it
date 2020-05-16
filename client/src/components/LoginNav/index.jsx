import React from "react";
import {NavLink} from "react-router-dom";
import './style.css';
import logo from '../../assets/logo.png';

function LoginNav() {
    return(
        <div id="navbar-body">
            <img id="logo" src={logo} alt="tag.it" />

            <div id="nav-right">
                <nav>
                    <NavLink to="/login">Log In</NavLink>
                    <NavLink to="/signup">Sign Up</NavLink>
                </nav>
            </div>
        </div>

    );
};

export default LoginNav;