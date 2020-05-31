import React, { useState, useEffect } from 'react';
import './style.css';
import Label from '../../components/Label';
import SuggestionTextField from '../../components/SuggestionTextField';
import Button from '../../components/Button';
import API from '../../utils/API';
import { AuthContext } from '../../auth/Auth';
import { useContext } from 'react';
import NavBar from "../../components/Navbar"

const AddClass = ({history, currentUser}) => {
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
            <SuggestionTextField name={`Class ${value}`} options={courseOptions} type={"class"}
                                 onBlur={(id) => onBlurSetClasses(index, id)} key={index}/>
        );
    };

    const renderClassLabels = () => {
        if (!currentUser) {
            return <></>
        };

        const studentLabels = currentUser.studentCourseList.map((val) => 
            <Label type="student">{val}</Label>
        );
        const instructorLabels = currentUser.instructorCourseList.map((val) => 
            <Label type="instructor">{val}</Label>
        );
        
        return studentLabels.concat(instructorLabels);
    };

    const onSubmit = () => {
        // Takes out all unfilled course fields
        const filteredArr = selectedClasses.filter((val) => val.length !== 0);

        // Accounts for case when no field has been filled
        if (filteredArr.length === 0) {
            window.alert("No classes to add are found. Please select a course to add by typing into the text field.");
            return;
        }

        // Resolves all the backend calls synchronously. 
        const addedClassesResult = filteredArr.reduce(async (previousPromise, nextID) => {
            await previousPromise;
            return API.addToCourse(nextID);
        }, Promise.resolve().catch(err => {
            window.alert("Some Course ID is not valid. Refresh the page.");
        }));

        // An error will only appear when all promises reject.
        addedClassesResult.then(e => {
            history.push("/");
        }).catch(e => {
            window.alert(`${e}. Check whether you are already added to these classes.`);
        });
    };

    return (
        <>
            <NavBar currentUser={currentUser}/>
            <div className="addClassPage">
                <div className="left-section"> 
                    <h1>Add a Class</h1>
                    {renderFields()}
                    <div className="buttons">
                        <Button text="Cancel" onSubmit={() => history.push("/")}/>
                        <Button text="Add Classes" onSubmit={onSubmit}/>
                    </div>
                </div>
                <div className="right-section">
                    <p>Current Classes</p>
                    <div className="scrollable-classes">
                        {renderClassLabels()}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddClass;