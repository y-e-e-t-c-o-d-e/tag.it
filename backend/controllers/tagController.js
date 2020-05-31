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
    // Object of fields and values to update in the tag object
    const bodyParams = req.body;
    const tagUUID = req.query.tagUUID;
    if (!tagUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing paramater: tagUUID"
        });
        return;
    };

    try {
        tagObj = getTagById(tagUUID);
        if ("name" in bodyParams) {
            tagObj.updateName(bodyParams["name"]);  // Change to setName in the future?
        }
        if ("parentTag" in bodyParams) {
            tagObj.setParentTag(bodyParams["parentTag"]);
        }
        if ("rmParentTag" in bodyParams) {
            tagObj.removeParentTag(bodyParams["rmParentTag"]);
        }
        if ("subTag" in bodyParams) {
            tagObj.addSubTag(bodyParams["subTag"]);
        }
        if ("rmSubTag" in bodyParams) {
            tagObj.removeSubTag(bodyParams["rmSubTag"]);
        }
        if ("post" in bodyParams) {
            tagObj.addPost(bodyParams["post"]);
        }
        if ("rmPost" in bodyParams) {
            tagObj.removePost(bodyParams["rmPost"]);
        }
        res.status(200).send("Updated tag");
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
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