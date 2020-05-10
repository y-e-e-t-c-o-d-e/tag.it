//Uncomment this wheen the models are good
//const user = require("../models/Course");

exports.addCourse = async (req, res) => {
    // TODO: Handle later with models
    res.status(200).send("Added course");
};

exports.getCourse = async (req, res) => {
    const courseUUID = req.query.courseUUID;
    if (!courseUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseUUID"
        });
        return;
    };

    // TODO: Delete mockData and replace with dynamic course model data.
    const mockData = {
        name: "CSE 283",
        instructorList: ["some instructor id", "another instuctor id"],
        studentList: ["some student id", "another student id"], 
        postList: ["some post id", "other post id"],
        tagList: ["some tag id", "other tag id"],
        isArchived: false
    };
    res.status(200).json(mockData);
};

exports.updateCourse = async (req, res) => {
    // Object of fields and values to update in the user object
    const updateParams = req.body;
    res.status(200).send("Updated course");
};