import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Label, SuggestionTextField, Navigation } from "../../components"
import { API, createToast } from '../../utils/';
import './style.css';

const AddClass = ({ history, currentUser }) => {
    const [selectedClasses, setSelectedClasses] = useState(["", "", "", "", ""]);
    const [courseOptions, setCourseOptions] = useState([]);

    useEffect(() => {
        API.getAllCourses().then((res) => {
            setCourseOptions(res.data);
        });
    }, []);

    // Used to update page state when text fields are updated
    const onBlurSetClasses = (index, value) => {
        const selected = selectedClasses;
        selected[index] = value;
        setSelectedClasses(selected);
    };

    // Renders each of the suggestion text fields
    const renderFields = () => {
        return [1, 2, 3, 4, 5].map((value, index) =>
            <SuggestionTextField name={`Course ${value}`} options={courseOptions} type={"class"}
                onBlur={(id) => onBlurSetClasses(index, id)} key={index} />
        );
    };

    const renderClassLabels = () => {
        if (!currentUser) {
            return <></>
        };

        const studentLabels = currentUser.filledInStudentCourseList.map((val, key) =>
            <Label key={key} type="student">{val.name}</Label>
        );
        const instructorLabels = currentUser.filledInInstructorCourseList.map((val, key) =>
            <Label key={key} type="instructor">{val.name}</Label>
        );

        return studentLabels.concat(instructorLabels);
    };

    const onSubmit = () => {
        // Takes out all unfilled course fields
        const filteredArr = selectedClasses.filter((val) => val.length !== 0);

        // Accounts for case when no field has been filled
        if (filteredArr.length === 0) {
            createToast("No courses to add are found. Please select a course to add by typing into the text field.");
            return;
        }

        // Resolves all the backend calls synchronously.
        const addedClassesResult = filteredArr.reduce(async (previousPromise, nextID) => {
            await previousPromise;
            return API.addToCourse(nextID);
        }, Promise.resolve().catch(err => {
            createToast("Some Course ID is not valid. Refresh the page.");
        }));

        // An error will only appear when all promises reject.
        addedClassesResult.then(e => {
            history.push("/");
        }).catch(e => {
            createToast(`${e}. Check whether you are already added to these courses.`);
        });
    };

    return (
        <>
            <Navigation history={history} currentUser={currentUser} />
            <div className="addClassPage">
                <div className="left-section">
                    <h1>Add a Course</h1>
                    {renderFields()}
                    <div className="buttons">
                        <Button variant="warning" onClick={() => history.push("/")}>Cancel</Button>
                        <Button variant="warning" onClick={onSubmit}>Add Courses</Button>
                    </div>
                </div>
                <div className="right-section">
                    <p>Current Courses</p>
                    <div className="scrollable-classes">
                        {renderClassLabels()}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddClass;