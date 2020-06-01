//Uncomment this wheen the models are good
const comment = require("../models/Comment");
const post = require("../models/Post")

exports.addComment = async (req, res) => {
    // TODO: Fix this later.
    const bodyParams = req.body;

    // parentComment is optional
    const content = bodyParams["content"];
    const postId = bodyParams["postId"];
    const parentComment = bodyParams["parentComment"];
    bodyParams["author"] = req.user.getUUID();

    if (!postId || !content) {
        res.status(422).json({
            status: 422,
            error: "Missing one of the following parameters: postId or content"
        });
        return;
    };

    try {
        const commentObjKey = await comment.pushCommentToFirebase(bodyParams);
        const commentObj = await comment.getCommentById(commentObjKey);
        // Provided parentComment id
        if (parentComment) {
            const parentCommentObj = await comment.getCommentById(parentComment);
            parentCommentObj.addChild(commentObjKey);
        } else {
            const postObj = await post.getPostById(postId);
            postObj.addComment(commentObjKey);
        }

        res.status(200).json("Comment added");
    } catch (e) {
        res.status(410).json({
            error: e,
            status: 410
        });
    }
};

exports.getComment = async (req, res) => {
    const postUUID = req.query.postUUID;
    if (!postUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: postUUID"
        });
        return;
    };

    try {
        const postObj = await post.getPostById(postUUID);
        // Gets all the high level comments
        const commentsList = postObj.getCommentList();

        const allComments = await commentsList.reduce(async (acc, val) => {
            let commentObj = await comment.getCommentById(val);

            // Comment does exist
            if (commentObj) {
                commentObj = await getSubComments(commentObj);
                (await acc).push(commentObj);
            }
            return acc;
        }, []);

        const commentResponse = allComments.map(val => val.props);
        res.status(200).json(commentResponse);
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        })
    }
};

exports.updateComment = async (req, res) => {
    // Object of fields and values to update in the user object
    const updateParams = req.body;
    res.status(200).send("Updated comment");
};

// Helper methods

/**
 * Recursive method that gets all of the subcomments within a comment
 */

const getSubComments = async (commentObj) => {
    if (commentObj.getChildList().length === 0 ) { 
        return commentObj; 
    }

    const subComments = await commentObj.getChildList().reduce(async (acc, subCommentId) => {
        try {
            let subComment = await comment.getCommentById(subCommentId);

            subComment = await getSubComments(subComment);
            (await acc).push(subComment.props);

            return acc;
        } catch (e) {
            return acc;
        }
    }, Promise.resolve([]));

    commentObj.props.childList = subComments;
    return commentObj;
}

// Adds comment to user's likedCommentList if not there already, removes post otherwise
exports.toggleLike = async (req, res) => {
    const userObj = req.user;
    const commentUUID = req.query.commentUUID;
    if (!commentUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: commentUUID"
        });
        return;
    };
    
    try {
        if (userObj.getLikedCommentList().indexOf(commentUUID) == -1) {
            await userObj.addLikedComment(commentUUID);
            res.status(200).json((await comment.getCommentById(commentUUID)).props);
        } else {
            await userObj.removeLikedComment(commentUUID);
            res.status(200).json((await comment.getCommentById(commentUUID)).props);
        }
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e.message
        });
    };
}