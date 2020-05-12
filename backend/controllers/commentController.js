//Uncomment this wheen the models are good
//const comment = require("../models/Comment");

exports.addComment = async (req, res) => {
    // TODO: Handle later with models
    res.status(200).send("Added comment");
};

exports.getComment = async (req, res) => {
    const commentUUID = req.query.commentUUID;
    if (!commentUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: commentUUID"
        });
        return;
    };

    // TODO: Delete mockData and replace with dynamic course model data.
    const mockData = {
        content: "some enlightening content about cs",
        score: 12,
        postID: "some post id",
        author: "some user id", 
        isEndorsed: false,
        isAnonymous: false,
        isResolved: false,
        childrenList: ["some comment id", "other comment id"],
        parentComment: "some comment id"
    };
    res.status(200).json(mockData);
};

exports.updateComment = async (req, res) => {
    // Object of fields and values to update in the user object
    const updateParams = req.body;
    res.status(200).send("Updated comment");
};