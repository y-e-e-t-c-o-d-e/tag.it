/** AutoSuggest Methods for Classes */
import React from 'react';

export default {
    getSuggestionValue: (suggestion) => {
        return `${suggestion.name} - ${suggestion.term}`;
    },
    
    // Sets the id in the state in order to easily fetch from Firebase
    renderSuggestion: (suggestion, setId) => {
        return (
            <div className="classSuggestion" onClick={() => setId(suggestion.uuid)}>
                <span>{suggestion.name} - {suggestion.term}</span>
                <span className="courseId">Course Id: {suggestion.uuid}</span>
            </div>
            
        );
    },
    
    getSuggestions: (value, options) => {
        return options.filter((x) => x.name.toLowerCase().indexOf(value.value.toLowerCase()) >= 0);
    },
}