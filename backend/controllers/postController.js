// TODO: uncomment when models are done
const post = require("../models/Post");
const Tag = require("../models/Tag");
const User = require("../models/User")

exports.addPost = async (req, res) => {
    // TODO: Handle later with models
    const bodyParams = req.body;
    // Checking if all values are present, and defaulting if not present
    if (!(bodyParams["title"] &&  bodyParams["content"] && bodyParams["author"] && bodyParams["course"]) ) {
        res.status(422).json({
            status: 422,
            error: "Missing one of the following: title, content, author, or course"
        })
        return
    }
    try {
        const key = await post.pushPostToFirebase(bodyParams);
        res.status(200).send(`Added post ${key}`)
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        })
    }
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

    const postObj = await post.getPostById(postUUID)
    postObj.props.filledInTags = await Promise.all(postObj.getTagList().map(async tagUUID => {
        return (await Tag.getTagById(tagUUID)).props
    }))

    // get author's name

    postObj.props.authorName = (await User.getUserById(postObj.getAuthor())).getName();

    res.status(200).json(postObj.props);
};

exports.updatePost = async (req, res) => {
    const bodyParams = req.body;
    const postUUID = req.query.postUUID;
    if (!postUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing paramater: postUUID"
        });
        return;
    };

    try {
        const postObj = await getPostById(postUUID);
        if ("isPinned" in bodyParams) {
            postObj.setPinned(bodyParams["isPinned"]);
        }
        if ("isResolved" in bodyParams) {
            postObj.setResolved(bodyParams["isResolved"]);
        }
        res.status(200).json(postObj);
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
};

// Adds user to post's following list if not there already, removes user otherwise
exports.toggleFollow = async (req, res) => {
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
            userObj.addFollowedPost(postUUID);
            res.status(200).send("Added user as a follower");
        } else {
            userObj.removeFollowedPost(postUUID);
            res.status(200).send("Removed user as a follower");
        }
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e.message
        });
    };
}

// Adds post to user's likedPostList if not there already, removes post otherwise
exports.toggleLike = async (req, res) => {
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
        if (userObj.getLikedPostList().indexOf(postUUID) == -1) {
            await userObj.addLikedPost(postUUID);
            res.status(200).json(await post.getPostById(postUUID));
        } else {
            await userObj.removeLikedPost(postUUID);
            res.status(200).json(await post.getPostById(postUUID));
        }
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e.message
        });
    };
}