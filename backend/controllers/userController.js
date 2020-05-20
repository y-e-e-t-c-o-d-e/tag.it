const user = require("../models/User");
const course = require("../models/Course");

exports.addUser = async (req, res) => {
    // Check that required data is given
    const bodyParams = req.body;
    if (!("name" in bodyParams || "email" in bodyParams || "uuid" in bodyParams)) {
        res.status(422).json({
            status: 422,
            error: "Missing one of the following parameters: name, email, or uuid"
        });
        return;
    };

    try {
        await user.pushUserToFirebase(bodyParams);
        res.status(200).send(`Added user ${bodyParams.uuid}`)
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: "Server could not push to firebase"
        })
    }
};

exports.getUser = async (req, res) => {
    const userUUID = req.query.userUUID;
    if (!userUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing paramater: userUUID"
        });
        return;
    };

    // Grabs the user based on the userUUID. If fails, responds with an error.
    try {
        const userObj = await user.getUserById(userUUID);
        res.status(200).json(userObj.props);
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
};

exports.updateUser = async (req, res) => {
    // Object of fields and values to update in the user object
    const updateParams = req.body;
    res.status(200).send("Updated user.");
};

// DEFAULTS TO ADDING USER AS A STUDENT
exports.addUserToCourse = async (req, res) => {
    const courseUUID = req.params.courseId;
    let userObj = req.user;
    if (!courseUUID || !userObj) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseUUID or userUUID"
        });
        return;
    };


    // Adds the user to the course as a student. If fails, responds with an error. Only works with users we've manually made
    try {
        let courseObj = await course.getCourseById(courseUUID);
        await courseObj.addStudent(userObj.getUUID());
        await userObj.addStudentCourse(courseObj.getUUID());
        res.status(200).send("Added user to course.");
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
};

exports.getUserType = async (req, res) => {
    const courseUUID = req.params.courseId;
    const userObj = req.user;

    if (!courseUUID || !userObj) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseUUID or user"
        });
        return;
    };

    // Grabs the user's type based on the courseUUID. If fails, responds with an error.
    try {
        const courseObj = await course.getCourseById(courseUUID);

        if (courseObj.getInstructorList().indexOf(userObj.getUUID()) != -1) {
            res.status(200).send("Instructor"); // send something else??
        } else if (courseObj.getStudentList().indexOf(userObj.getUUID()) != -1) {
            res.status(200).send("Student");    // send something else??
        } else {
            res.status(200).send("User not in this class");
        }
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
};