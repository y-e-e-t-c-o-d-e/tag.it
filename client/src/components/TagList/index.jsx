import React, { useState } from 'react'
import './style.css';
import { Button, ListGroup, Row, Col } from "react-bootstrap";


const TagList = ({tags}) => {
    const [search, setSearch] = useState(""); // default to no search input
    
    return (
        <div className="tag-section">
            <Row>
                <Col>
                    <input className="search" type="text" placeholder="Search..." onChange={ e => setSearch(e.target.value)} />
                </Col>
                <Col>
                    <Button variant="warning" className="btn-style search-btn"><b>search.it</b></Button>
                </Col>
            </Row>

            <div className="tagList">
                { 
                    tags.filter(
                        tag => tag.title.includes(search)
                    ).map(tag => {
                        return <Button variant="primary" block key={tag.uuid} className="tagItem"><b>{tag.title}</b></Button>
                    }) 
                }
            </div>
        </div>
    );
}

export default TagList