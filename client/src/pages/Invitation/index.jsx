import React, {useState, useEffect } from "react";
import Button from "../../components/Button/index";
import './style.css';
import API from "../../utils/API";

function Invitation(props){
    return(
        <div>
            {/* Insert Nav bar here... */}
            <div className="content">
                <div className="box">

                    {/* Heading and line after */}
                    <div className="center-items">
                        <h1>Class Settings</h1>
                        <hr/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invitation;