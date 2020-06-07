import React, { useState } from 'react'
import { Button, Row, Col } from "react-bootstrap";
import './style.css';

const TagList = ({ tags, filters, setFilters }) => {
    const [search, setSearch] = useState(""); // default to no search input
    const [selectedTags, setSelectedTags] = useState(new Set());

    /* Displays the tags in the course */
    const tagContent = tags.map((tag, key) => {
                        return <Button variant={selectedTags.has(tag) ? "success" : "primary"} block key={tag.uuid} className="tagItem" onClick={() => {
                            if (selectedTags.has(tag)) {
                                selectedTags.delete(tag);
                            } else {
                                selectedTags.add(tag);
                            }
                            setFilters({...filters, tags: Array.from(selectedTags)})
                        }}><b>{tag.name}</b></Button>
                    });
    
    /* Indicates there are no tags for the course */
    const emptyTagContent = (
        <div className="empty-tag-content">
            <p>There are no tags for this class yet.</p>
            <p>Instructors can edit the tags in Course Settings > Edit Tags</p>
        </div>
    );

    /* Renders the tag body depending on whether there are tags for the class */
    let tagBody = tags.length? tagContent:emptyTagContent;

    return (
        <div className="tag-section">
            <Row>
                <Col>
                    <input className="search" type="text" defaultValue={search} placeholder="Search..." onChange={e => {
                        const val = e.target.value
                        setSearch()
                        setFilters({...filters, search: val})
                    }} />
                </Col>
                <Col>
                    <Button variant="warning" className="btn-style search-btn"><b>search.it</b></Button>
                </Col>
            </Row>

            <div className="tagList">
                {
                 tagBody   
                }
            </div>
        </div>
    );
}

export default TagList