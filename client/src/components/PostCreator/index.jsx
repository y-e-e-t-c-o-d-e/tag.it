import React, { useState } from 'react'
import './style.css';
import { Dropdown, DropdownButton, Button, Form, Row, Col } from 'react-bootstrap';
import PostEditor from "../PostEditor";

const PostCreator = ({}) => {
    const [tags, setTags] = useState([{name: "sample tag", uuid: "jlkd8f2348"}]); // all possible tags
    const [addedTags, setAddedTags] = useState(new Set()); // tags that have been added to this post
    const [visibility, setVisiblity] = useState("public, visible");

    return (
        <div className="post-creator">
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Question Summary</Form.Label>
                    <Form.Control type="value" placeholder="How do I build a rock from sand?" />
                </Form.Group>

                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows="5" />
                </Form.Group> 
            </Form>
            
            <div className="post-buttons">
                <Row>
                    <Col md={3}>
                        <h3>Post as:</h3>
                    </Col>
                    <Col md={3}>
                        <DropdownButton id="dropdown-button-form" title={visibility} drop="up">
                            <Dropdown.Item as="button" onClick={() => { setVisiblity("public, visible")}} >public, visible</Dropdown.Item>
                            <Dropdown.Item as="button" onClick={() => { setVisiblity("public, anonymous")}} >public, anonymous</Dropdown.Item>
                            <Dropdown.Item as="button" onClick={() => { setVisiblity("private")}} >private</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                    <Col md={3}>
                        <DropdownButton id="dropdown-button-tags" title="tag.it" drop="up">
                            { 
                                tags.map((tag, key) => {
                                    return <Dropdown.Item key={key} as="button" onClick={() => {
                                        const newAddedTags = new Set(addedTags);
                                        if (addedTags.has(tag)) {
                                            newAddedTags.delete(tag);
                                        } else {
                                            newAddedTags.add(tag);
                                        }
                                        setAddedTags(newAddedTags);
                                    }}>{tag.name}</Dropdown.Item>
                                })
                            }
                        </DropdownButton>
                    </Col>
                    <Col md={3}>
                        <Button id="create-button">create.it</Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default PostCreator;