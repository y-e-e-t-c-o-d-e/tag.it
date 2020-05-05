import React from 'react';
import './style.css';

const Button = (props) => {
    return (
        <div className="button">
            <p>{props.text}</p>
        </div>
    )
}

export default Button;