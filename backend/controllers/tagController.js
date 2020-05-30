// TODO: uncomment when models are done
const tag = require("../models/tag");
const course = require("../models/course");

exports.addTag = async (req, res) => {
    // TODO: Handle later with models
    const bodyParams = req.body;
    if (!("name" in bodyParams || "course" in bodyParams)) {
        res.status(422).json({
            status: 422,
            error: "Missing one of the following parameters: name or course"
        });
        return;
    };

    try {
        await tag.pushTagToFirebase(bodyParams);
        res.status(200).send(`Added tag ${bodyParams.name}`)
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: "Server could not push to firebase"
        })
    }
};

// Gets all tags associated with a course
exports.getTag = async (req, res) => {
    const courseUUID = req.query.courseUUID;
    if (!courseUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseUUID"
        });
        return;
    };

    try {
        const courseObj = course.getCourseById(courseUUID);
        res.status(200).send(courseObj.getTagList())
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
};

exports.updateTag = async (req, res) => {
    // Object of fields and values to update in the Tag object
    const updateParams = req.body;
    res.status(200).send("Updated Tag.");
};

// Deletes course
exports.deleteTag = async (req, res) => {
    const tagUUID = req.query.tagUUID;
    if (!tagUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing paramater: tagUUID"
        });
        return;
    };

    try {
        tag.deleteTagByID(tagUUID);
        res.status(200).send("removed tag with the following tagUUID:" + tagUUID)
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
};