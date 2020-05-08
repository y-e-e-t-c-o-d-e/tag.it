const user = require("../models/User");

exports.getUser = async (req, res, next) => {
    const userUUID = req.query.userUUID;
    if (!userUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing paramater: userUUID"
        });
    };

    // TODO: Delete mockData and replace with dynamic user model data
    const mockData = {
        name: "Rick Ord",
        email: "rickord@retired.edu",
        icon: "", // Not sure how images are handled with firebase
        studentCourseList: ["some course id", "some other course id"],
        postList: ["some post id", "other post id"],
        followingList: ["some post id", "other post id"],
        commentList: [],
        instructorCourseList: ["some course id"]
    };
    res.status(200).json(mockData);
};

exports.updateUser = async (req, res, next) => {
    // Object of fields and values to update in the user object
    const updateParams = req.body;
    res.status(200).send("Updated user.");
};