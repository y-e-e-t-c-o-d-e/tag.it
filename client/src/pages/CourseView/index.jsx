import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom"
import './style.css';
import db from "../../base";
import Navigation from "../../components/Navbar";
import TagList from "../../components/TagList/index.jsx";
import { Row, Col, Nav, Button } from 'react-bootstrap';
import CoursesView from '../../components/CoursesView/index.jsx';
import QuestionList from "../../components/QuestionList"
import PostCreator from "../../components/PostCreator"
import { API } from '../../utils';

const states = {
    questions: "questions",
    createPost: "make.it"
}

const CourseView = ({currentUser, history }) => { 
    const { courseId } = useParams();

    const [course, setCourse] = useState({name: "Loading", postList: [], uuid: "Loading"});
    const [tags, setTags] = useState([])
    const [filters, setFilters] = useState({
        search: "",
        tags: []
    })
    const [view, setView] = useState(states.questions);

    useEffect(() => {
        API.getCourse(courseId).then(response => {
            console.log(response.data)
            setCourse(response.data)

            setTags(response.data.tagList.map(tag => {
                tag.toString = JSON.stringify(tag)
                return tag
            }))
        }).catch(err => {
            setCourse({name: "Error", postList: [], uuid: err})
        })
    }, [view])


    let action;

    switch (view) {
        case states.questions:
            action = <QuestionList courseId={courseId} questions={course.postList} history={history} filters={filters} />
            break;
        case states.createPost:
            action = <PostCreator tags={tags} setView={setView} views={states} courseId={courseId} />
    }

    return (
        <div className="home">
            <Navigation currentUser={currentUser} />
            <div className="cont">
                <h1>{course.name}</h1>
            <Row>
                <Col xs={4}>
                    <TagList tags={tags} filters={filters} setFilters={setFilters} />
                </Col>
                <Col>
                    <Row>
                        <Col xs={8}></Col>
                        <Col>
                            <Button variant="warning" onClick={() => { 
                                view === states.createPost ? setView(states.questions) : setView(states.createPost) }}>
                                    { view === states.createPost ? "cancel" : states.createPost}
                                </Button>
                            </Col>
                    </Row>

                    {action}
                </Col>
            </Row>
            </div>
            <h1></h1>
        </div>
    )

};

export default CourseView;