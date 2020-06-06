import React, { useState } from 'react'
import { Dropdown, DropdownButton, Button, Form, Row, Col } from 'react-bootstrap';
import PostEditor from "../PostEditor";
import AutocompleteTags from "../AutocompleteTags"
import { API, createToast, PostOptions} from '../../utils';
import './style.css';

const defaultPostOption = {...PostOptions[Object.keys(PostOptions)[0]], text: Object.keys(PostOptions)[0]}

const PostCreator = ({tags, courseId, setView, views}) => {
    // const [tags, setTags] = useState([{name: "sample tag", uuid: "jlkd8f2348"}]); // all possible tags
    const [addedTags, setAddedTags] = useState(new Set()); // tags that have been added to this post
    const [options, setOptions] = useState(defaultPostOption);

    // form content
    const [questionTitle, setQuestionTitle] = useState("");
    const [questionContent, setQuestionContent] = useState("**b**");
    
    const createPost = () => {
        if (questionTitle.length <=5) {
            createToast("make a longer title!")
            return;
        }
        if (questionContent.length <= 5) {
            createToast("make a longer post!")
            return;
        }
        
        const tagsToAdd = Array.from(selectedTags).map(tag => tag.uuid)
        API.createPost(questionTitle, questionContent, courseId, tagsToAdd, options).then((response) => {
            createToast(response.data)
            setView(views.questions)
        })
    }

    const [selectedTags, setSelectedTags] = useState([]);


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
            <AutocompleteTags validator={(tag) => {
                let valid = false
                for (const courseTag of tags) {
                    if (tag.name === courseTag.name) {
                        valid = true
                    }
                }
                return valid
            }} initialTags={[]} givenSuggestions={tags} setAddedTags={(tags)=>{
                                
                            }} setDeletedTags={(tags)=>{
                                
                            }} onChange={(tags) => {
                                setSelectedTags(tags)
                            }} />
                <Row>
                    <Col>
                        <h3>Post as:</h3>
                    </Col>
                    <Col>
                        <DropdownButton id="dropdown-button-form" title={options.text} drop="up">
                            {/* <Dropdown.Item as="button" onClick={() => { setVisiblity("public, visible")}} >public, visible</Dropdown.Item>
                            <Dropdown.Item as="button" onClick={() => { setVisiblity("public, anonymous")}} >public, anonymous</Dropdown.Item>
                            <Dropdown.Item as="button" onClick={() => { setVisiblity("private")}} >private</Dropdown.Item> */}
                            {Object.keys(PostOptions).map((optionText) => 
                                <Dropdown.Item as="button" onClick={() => setOptions({...PostOptions[optionText], text: optionText})}>{optionText}</Dropdown.Item> 
                            )}
                        </DropdownButton>
                    </Col>
                    <Col>
                        <Button id="create-button" onClick={createPost}>create.it</Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default PostCreator;