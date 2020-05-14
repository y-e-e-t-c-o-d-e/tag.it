import React from "react";
import Navbar from 'react-bootstrap/Navbar'
import './style.css';
import logo from '../../assets/logo.png';

function LoginNav () {
    return(
        <Navbar>
            <Navbar.Brand>
                <img id="logo" 
                className="d-inline-block align-top" 
                src={logo} alt="tag.it"
                />
            </Navbar.Brand>
        </Navbar>
    );
};

export default LoginNav;