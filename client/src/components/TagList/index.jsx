import React, { useState } from 'react'
import { Button, Row, Col } from "react-bootstrap";
import './style.css';

const TagList = ({ tags, filters, setFilters }) => {
    const [search, setSearch] = useState(""); // default to no search input
    const [selectedTags, setSelectedTags] = useState(new Set());

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
                    tags.map((tag, key) => {
                        return <Button variant={selectedTags.has(tag) ? "success" : "primary"} block key={tag.uuid} className="tagItem" onClick={() => {
                            if (selectedTags.has(tag)) {
                                selectedTags.delete(tag);
                            } else {
                                selectedTags.add(tag);
                            }
                            setFilters({...filters, tags: Array.from(selectedTags)})
                        }}><b>{tag.name}</b></Button>
                    })
                }
            </div>
        </div>
    );
}

export default TagList