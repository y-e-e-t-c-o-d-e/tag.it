import React from "react";
import './style.css';
import logo from '../../assets/logo.png';

function LoginNav() {
    return(
        <div id="navbar-body">
            <img id="logo" src={logo} alt="tag.it" />

            <div id="nav-right">
                <nav>
                    <a class="active" href="/login">Log In</a>
                    <a href="/signup">Sign Up</a>
                </nav>
            </div>
        </div>

    );
};

export default LoginNav;