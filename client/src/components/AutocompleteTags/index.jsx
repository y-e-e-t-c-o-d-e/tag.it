import React, { useState, useEffect } from 'react';
import ReactTags from 'react-tag-autocomplete';
import './style.css';

const AutocompleteTags = ({initialTags, onChange, setAddedTags, setDeletedTags, givenSuggestions}) => {
    // see package docs for additional options
    const [tags, setTags] = useState([])
    
    const [deleted, setDeleted] = useState([])
    const [added, setAdded] = useState([])
    const [suggestions, setSuggestions] = useState([
        { id: 0, name: "midterms" },
        { id: 1, name: "final exam" },
        { id: 2, name: "logistics" },
        { id: 3, name: "quizzes" }
    ])

    useEffect(() => {
        if (initialTags.length > 0) {
            setTags(initialTags);
        }
    }, [initialTags])
    
    useEffect(() => {
        if (givenSuggestions && givenSuggestions.length > 0) {
            setSuggestions(givenSuggestions);
        } else {
            setSuggestions([
                { id: 0, name: "midterms" },
                { id: 1, name: "final exam" },
                { id: 2, name: "logistics" },
                { id: 3, name: "quizzes" }
            ])
        }
    }, [givenSuggestions])

   

    const [delimiters, setDelimeters] = useState([9, 13, 32])

    const handleDelete = (index) => {
        // extract into classtagutil? pass in (i, this.state)?
        const tag = tags[index]
        const newTags = tags.slice(0);
        newTags.splice(index, 1);
        setTags(newTags);
        setDeleted(deleted.concat(tag))
        setDeletedTags(deleted.concat(tag))
        onChange(newTags)
    }

    const handleAddition = (tag) => {
        const newTags = [].concat(tags, tag);
        setTags(newTags);
        setAdded(added.concat(tag))
        setAddedTags(added.concat(tag))
        onChange(newTags)
    }

    return (
        <ReactTags
            tags={tags}
            suggestions={suggestions}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            allowNew={true}
            delimiters={delimiters} 
        />
    );
}

export default AutocompleteTags;