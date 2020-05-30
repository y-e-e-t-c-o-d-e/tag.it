//Uncomment this wheen the models are good
const comment = require("../models/Comment");
const post = require("../models/Post")

exports.addComment = async (req, res) => {
    // TODO: Fix this later.
    const bodyParams = req.body;

    const visibility = bodyParams["visibility"];
    const content = bodyParams["content"];
    const postId = bodyParams["postId"]
    const parentUUID = bodyParams["parentUUID"];

    if (!visibility || !content) {
        res.status(422).json({
            status: 422,
            error: "Missing one of the following parameters: visibility or content"
        });
        return;
    };

    try {
        const commentObj = await comment.pushCommentToFirebase(bodyParams);
        res.status(200).json("Created");
    } catch (e) {
        res.status(410).json({
            error: "Yikes",
            status: 410
        });
    }

    res.status(200).send("Added comment");
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
        const commentsList = postObj.getComments();
        const allComments = await commentsList.reduce(async (acc, val) => {
            let commentObj = await comment.getCommentById(val);

            // Comment does exist
            if (commentObj) {
                commentObj = await getSubComments(commentObj);
                acc.push(commentObj);
            }
            return acc;
        }, []);

        const commentResponse = allComments.map(val => val.props);
        res.status(200).json(commentResponse);
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: "Yikes"
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
            console.log(acc);
            return acc;
        } catch (e) {
            return acc;
        }
    }, Promise.resolve([]));

    commentObj.props.childList = subComments;
    return commentObj;
}