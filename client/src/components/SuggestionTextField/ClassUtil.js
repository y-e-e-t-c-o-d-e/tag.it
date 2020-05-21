/** AutoSuggest Methods for Classes */
import React from 'react';

export default {
    getSuggestionValue: (suggestion) => {
        return suggestion.courseName;
    },
    
    // Sets the id in the state in order to easily fetch from Firebase
    renderSuggestion: (suggestion, setId) => {
        return (
            <div className="classSuggestion" onClick={() => setId(suggestion.courseId)}>
                <span>{suggestion.courseName}</span>
                <span className="courseId">Course Id: {suggestion.courseId}</span>
            </div>
            
        );
    },
    
    getSuggestions: (value, options) => {
        return options.filter((x) => x.courseName.toLowerCase().indexOf(value.value.toLowerCase()) >= 0);
    },
}