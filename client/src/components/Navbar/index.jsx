import React, { useState, useContext } from 'react';
import { AuthContext } from "../../auth/Auth";
import {NavLink} from "react-router-dom";
import './style.css';
import logo from '../../assets/logo.png';

const loginRender = () => (
    <div id="navbar-body">
        <img id="logo" src={logo} alt="tag.it" />

        <div id="nav-right">
            <nav>
                <NavLink to="/login">Log In</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
            </nav>
        </div>
    </div>
)

const regularRender = () => (
    <div id="navbar-body">
        <img id="logo" src={logo} alt="tag.it" />

        <div id="nav-right">
            <nav>
                <NavLink to="/login">courses</NavLink>
                <NavLink to="/calendar">calendar</NavLink>
                <NavLink to="/logout">logout</NavLink>
            </nav>
        </div>
    </div>
)

const NavBar = ({}) => {
    const { currentUser } = useContext(AuthContext);
    if (currentUser) {
        return regularRender();
        // return <Redirect to="/" />;
    } else {
        return loginRender();
    }
}

export default NavBar;