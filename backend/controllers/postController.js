// TODO: uncomment when models are done
const post = require("../models/post");

exports.addPost = async (req, res) => {
    // TODO: Handle later with models
    res.status(200).send("Added post");
};

exports.getPost = async (req, res) => {
    const postUUID = req.query.postUUID;
    if (!postUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: postUUID"
        });
        return;
    };

    // TODO: Delete mockData and replace with dynamic user model data.
    const mockData = {
        title: "Test Title",
        content: "Hey this is a Body of the Post!",
        author: "userUUID here",
        tagList: ["some tag id", "some tag id"],
        commentList: ["some comment id", "some comment id"],
        followingList: ["some user id", "some user"],
        isAnnouncement: false,
        isPinned: false,
        isResolved: false,
        isPrivate: false,
        isAnonymous: false,
        score: 12,
        isInstructor: false,
    };
    res.status(200).json(mockData);
};

exports.updatePost = async (req, res) => {
    // Object of fields and values to update in the Post object
    const updateParams = req.body;
    res.status(200).send("Updated Post.");
};

// Adds user to post's following list if not there already, removes user otherwise
exports.toggleFollowing = async (req, res) => {
    const userObj = req.user;
    const postUUID = req.query.postUUID;
    if (!postUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: postUUID"
        });
        return;
    };
    
    try {
        let postObj = await post.getPostById(postUUID);
        const userUUID = userObj.getUUID();
        if (postObj.getUsersFollowing().indexOf(userUUID) == -1) {
            postObj.addFollower(userUUID);
        } else {
            postObj.removeFollower(userUUID);
        }
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e.message
        });
    };
}