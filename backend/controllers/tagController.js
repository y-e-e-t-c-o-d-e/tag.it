// TODO: uncomment when models are done
const tag = require("../models/Tag");
const course = require("../models/Course");

exports.addAndRemoveTags = async (req, res) => {
    const bodyParams = req.body;
    if (!(bodyParams["removedTags"] && bodyParams["newTags"] && bodyParams["courseId"])) {
        res.status(422).json({
            status: 422,
            error: "Missing one of the following parameters: removedTags or newTags"
        });
        return;
    };

    // List of removedTags as emails 
    const removedTags = bodyParams["removedTags"];
    const newTags = bodyParams["newTags"];
    const courseId = bodyParams["courseId"];

    try {
        // Iterates through all the removedTags
        for (let tagId of removedTags) {
            // Model should handle logic to delete the tags from the posts
            await tag.deleteTagById(tagId);
        }

        // Iterates through all the new tags to create
        for (let tagName of newTags) {
            await tag.pushTagToFirebase({
                "name": tagName,
                "course": courseId
            });
        }

        res.status(200).send(`Added & removed tags successfully`)
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e.message
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
        const courseObj = await course.getCourseById(courseUUID);
        res.status(200).json(courseObj.getTagList())
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
        const tagObj = await getTagById(tagUUID);
        if ("name" in bodyParams) {
            tagObj.setName(bodyParams["name"]);
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
        await tag.deleteTagById(tagUUID);
        res.status(200).send("removed tag with the following tagUUID:" + tagUUID)
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
};

