import React, { useState } from 'react'
import './style.css';
import { Dropdown, DropdownButton, Button, Form, Row, Col } from 'react-bootstrap';
import PostEditor from "../PostEditor";
import { API, createToast} from '../../utils';

const PostCreator = ({courseId, setView, views}) => {
    const [tags, setTags] = useState([{name: "sample tag", uuid: "jlkd8f2348"}]); // all possible tags
    const [addedTags, setAddedTags] = useState(new Set()); // tags that have been added to this post
    const [visibility, setVisiblity] = useState("public, visible");

    // form content
    const [questionTitle, setQuestionTitle] = useState("");
    const [questionContent, setQuestionContent] = useState("**b**");
    
    const createPost = () => {
        API.createPost(questionTitle, questionContent, courseId).then((response) => {
            console.log(response)
            createToast(response.data)
            setView(views.questions)
        })
    }



    return (
        <div className="post-creator">
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Question Summary</Form.Label>
                    <Form.Control type="value" placeholder="How do I build a rock from sand?" onChange={(e) => { setQuestionTitle(e.target.value) }} />
                </Form.Group>
                <PostEditor postText={questionContent} setPostText={setQuestionContent}></PostEditor>
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
                        <Button id="create-button" onClick={createPost}>create.it</Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default PostCreator;