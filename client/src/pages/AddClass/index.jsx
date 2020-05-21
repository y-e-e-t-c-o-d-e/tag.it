import React, { useState } from 'react';
import './style.css';
import Label from '../../components/Label';
import SuggestionTextField from '../../components/SuggestionTextField';
import Button from '../../components/Button';
import API from '../../utils/API';

const AddClass = ({history}) => {
    // TODO: Replace with dynamic data in future PR once backend is done.
    let classes = [
        {
            courseName: "CSE 100",
            courseId: "course283"
        },
        {
            courseName: "CSE 105",
            courseId: "course1"
        },
        {
            courseName: "MATH 183",
            courseId: "12345"
        }
    ];

    const [selectedClasses, setSelectedClasses] = useState(["", "", "", "", ""]);

    // Used to update page state when text fields are updated
    const onBlurSetClasses = (index, value) => {
        const selected = selectedClasses;
        selected[index] = value;
        setSelectedClasses(selected);
    };

    // Renders each of the suggestion text fields
    const renderFields = () => {
        return [1, 2, 3, 4, 5].map((value, index) => 
            <SuggestionTextField name={`Class ${value}`} options={classes} type={"class"}
                                 onBlur={(id) => onBlurSetClasses(index, id)} key={index}/>
        );
    };

    const renderClassLabels = () => {
        const labels = [
            "CSE 127",
            "CSE 120"
        ];
        return labels.map((value) => 
            <Label>{value}</Label>
        )
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