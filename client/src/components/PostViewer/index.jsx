import React, { useState } from 'react';
import { Dropdown, DropdownButton, Button, Container, Row, Col } from 'react-bootstrap';
import './style.css';

const PostViewer = (props) => {
    return(
        <div className="post-viewer">
            <div className="post-title-section">
                <input readOnly className="post-title-view" value="Yeet Test"/>
                <div className="title-button-section">
                    <Button className="yellow-button">change.it</Button>
                    <DropdownButton className="yellow-button" title="actions">
                        <Dropdown.Item key="follow" as="button">Follow Post</Dropdown.Item>
                        <Dropdown.Item key="copy-link" as="button">Copy Link</Dropdown.Item>
                        <Dropdown.Item key="resolve" as="button">Resolve</Dropdown.Item>
                    </DropdownButton>
                </div>
            </div>
            <div className="post-content-section">
                <div className="post-content-view">
                    YeetCode is a great team. <br/>
                </div>
                <div className="posted-by">Posted by: Maggie Test</div>
            </div>
                    <Container className="post-view-buttons">
                        <Row>
                            <Col xs={6} md={4}>
                                <Row>
                                <div className="likes">18</div>
                                <Button className="yellow-button">like.it</Button>
                                </Row>

                                <Row>
                                <Button className="yellow-button">discuss.it</Button>
                                </Row>

                            </Col>
                            <Col>
                            Hi...?
                            </Col>
                        </Row>
                    </Container>
                    
                </div>

    );
};

export default PostViewer;