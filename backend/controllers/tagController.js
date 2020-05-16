// TODO: uncomment when models are done
//const post = require("../models/tag");

exports.addTag = async (req, res) => {
    // TODO: Handle later with models
    res.status(200).send("Added tag");
};

exports.getTag = async (req, res) => {
    const postUUID = req.query.postUUID;
    if (!postUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: tagUUID"
        });
        return;
    };

    // TODO: Delete mockData and replace with dynamic user model data.
    const mockData = {
        name: "name", 
        numUsed: 16,
        parentTag: "tag id of parent id", 
        subTags: ["some tag id", "some other tag id"],
        course: "course id",
        postList: ["post id", "some other post id"],
    };
    res.status(200).json(mockData);
};

exports.updateTag = async (req, res) => {
    // Object of fields and values to update in the Tag object
    const updateParams = req.body;
    res.status(200).send("Updated Tag.");
};
