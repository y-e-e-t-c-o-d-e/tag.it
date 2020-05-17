import React, {useState} from 'react';
import "./style.css";
import AutoSuggest from 'react-autosuggest';
import ClassUtil from './ClassUtil';

// Add new UTIL files here when needed
const utilMap = {
    "class": ClassUtil
};

// Each prop is required to use this component
const SuggestionTextField = ({name, options, onBlur, type}) => {
    const [textValue, setTextValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    
    // Changes state value when text field value updates
    const onChange = (e, {newValue}) => {
        setTextValue(newValue);
    };

    // Input for suggestion text boxes
    const inputProps = {
        value: textValue,
        placeholder: 'Ex. CSE110',
        onChange: onChange,
        onBlur: onBlur
    };

    // Specifies what util methods to use 
    let util = utilMap[type];

    return (
        <div className="classTextField">
            <p>{name}</p>
            <AutoSuggest
                suggestions={suggestions}
                inputProps={inputProps}
                onSuggestionsFetchRequested={(value) => { 
                    setSuggestions(util.getSuggestions(value, options)); 
                }}
                onSuggestionsClearRequested={() => { setSuggestions([]); }}
                getSuggestionValue={util.getSuggestionValue}
                renderSuggestion={util.renderSuggestion}
            />
        </div>
    );
};

export default SuggestionTextField;