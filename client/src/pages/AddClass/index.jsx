import React, { useState } from 'react';
import './style.css';
import Label from '../../components/Label';
import SuggestionTextField from '../../components/SuggestionTextField';
import Button from '../../components/Button';

const AddClass = ({history}) => {
    // TODO: Replace with dynamic data in future PR once backend is done
    let classes = [
        {
            courseName: "CSE 100",
            courseId: "12345"
        },
        {
            courseName: "CSE 105",
            courseId: "12345"
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
                                 onBlur={(e) => onBlurSetClasses(index, e.target.value)} key={index}/>
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

    const onSubmit = (e) => {
        // TODO: Add logic to add user to these courses and send them to a course page
        console.log(selectedClasses);
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