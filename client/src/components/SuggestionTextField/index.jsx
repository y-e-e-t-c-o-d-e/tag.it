import React, {useState} from 'react';
import "./style.css";
import AutoSuggest from 'react-autosuggest';
import ClassUtil from './ClassUtil';

// Add new UTIL files here when needed
const utilMap = {
    "class": ClassUtil
};

const defaultTextMap = {
    "class": "Ex. CSE110"
};

// Each prop is required to use this component
const SuggestionTextField = ({name, options, onBlur, type}) => {
    const [textValue, setTextValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [id, setId] = useState('');
    
    // Changes state value when text field value updates
    const onChange = (e, {newValue}) => {
        setTextValue(newValue);
    };

    // Input for suggestion text boxes
    const inputProps = {
        value: textValue,
        placeholder: defaultTextMap[type],
        onChange: onChange,
        onBlur: () => onBlur(id)
    };

    // Specifies what util methods to use 
    let util = utilMap[type];

    return (
        <div className="suggestionTextField">
            <p>{name}</p>
            <AutoSuggest
                suggestions={suggestions}
                inputProps={inputProps}
                onSuggestionsFetchRequested={(value) => { 
                    setSuggestions(util.getSuggestions(value, options)); 
                }}
                onSuggestionsClearRequested={() => { setSuggestions([]); }}
                getSuggestionValue={util.getSuggestionValue}
                renderSuggestion={(suggestion) => util.renderSuggestion(suggestion, setId)}
            />
        </div>
    );
};

export default SuggestionTextField;