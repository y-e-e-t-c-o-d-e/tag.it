import React from 'react';
import './style.css';

const Button = ({text, onSubmit, ...rest}) => {
    return (
        <div className="button" onClick={onSubmit}>
            <p>{text}</p>
        </div>
    )
}

export default Button;