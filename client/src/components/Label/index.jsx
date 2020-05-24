import React from 'react';
import './style.css';

const Label = (props) => {
    return (
        <div className={`label ${props.type}`}>
            <p>{props.children}</p>
        </div>
    )
};

export default Label;