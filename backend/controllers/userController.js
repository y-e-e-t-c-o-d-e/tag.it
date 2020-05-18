const user = require("../models/User");

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

exports.addUserToCourse = async (req, res) => {
    const courseID = req.query.courseID;
    if (!courseID) {
        res.status(422).json({
            status: 422,
            error: "Missing paramater: courseID"
        });
        return;
    };

    // Grabs the user based on the userUUID. If fails, responds with an error.
    try {
        const courseObj = await user.getCourseById(courseID);
        res.status(200).json(userObj.props);
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
};