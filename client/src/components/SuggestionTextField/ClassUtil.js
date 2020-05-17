/** AutoSuggest Methods for Classes */
import React from 'react';

export default {
    getSuggestionValue: (suggestion) => {
        return suggestion.courseName;
    },
    
    renderSuggestion: (suggestion) => {
        return (
            <span>{suggestion.courseName}</span>
        );
    },
    
    getSuggestions: (value, options) => {
        return options.filter((x) => x.courseName.toLowerCase().indexOf(value.value.toLowerCase()) >= 0);
    },
}