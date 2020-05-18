/** AutoSuggest Methods for Classes */
import React from 'react';

export default {
    getSuggestionValue: (suggestion) => {
        return suggestion.courseName;
    },
    
    renderSuggestion: (suggestion) => {
        return (
            <div className="classSuggestion">
                <span>{suggestion.courseName}</span>
                <span className="courseId">Course Id: {suggestion.courseId}</span>
            </div>
            
        );
    },
    
    getSuggestions: (value, options) => {
        return options.filter((x) => x.courseName.toLowerCase().indexOf(value.value.toLowerCase()) >= 0);
    },
}