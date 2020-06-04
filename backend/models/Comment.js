const { db } = require("../shared/firebase")
const User = require("./User")
const Post = require("./Post")

class Comment {
    constructor(props) {
        this.props = props;
    }

    equalTo(other) {
        return (
            this.props.author === other.props.author &&
            this.arraysEqual(this.props.childList, other.props.childList) &&
            this.props.content === other.props.content &&
            this.props.isAnonymous === other.props.isAnonymous &&
            this.props.isEndorsed === other.props.isEndorsed &&
            this.props.isResolved === other.props.isResolved &&
            this.props.parentComment === other.props.parentComment &&
            this.props.postId === other.props.postId &&
            this.props.score === other.props.score &&
            //this.props.time === other.props.time && I feel like its a bad idea to put time as a thing, that's always going to be different realistically.
            this.props.uuid === other.props.uuid
        )
    }

    arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.
        // Please note that calling sort on an array will modify that array.
        // you might want to clone your array first.

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }


    updateComment = async () => {
        let comment = await getCommentById(this.getUUID());
        while (!this.equalTo(comment)) {
            this.props = comment.props;
            comment = await getCommentById(this.getUUID());
        }
    }

    /**
     * Update a given user's data fields.
     *
     * @param updateParams - Object consisting of keys & values that will be updated for the user
     */
    getContent() {
        return this.props.content;
    }

    getAuthor() {
        return this.props.author;
    }

    getUUID() {
        return this.props.uuid;
    }

    getTime() {
        return this.props.time;
    }

    getPostId() {
        return this.props.postId;
    }

    getParentComment() {
        return this.props.parentComment;
    }

    getScore() {
        return this.props.score;
    }

    getCourse() {
        return this.props.course;
    }

    getScore() {
        return this.props.score;
    }

    getEndorsed() {
        return this.props.isEndorsed;
    }

    getResolved() {
        return this.props.isResolved;
    }

    getAnonymous() {
        return this.props.isAnonymous;
    }

    getChildList() {
        return this.props.childList.slice(1, this.props.childList.length);
    }

    addChild = async (commentId) => {
        await this.updateComment();
        this.props.childList.push(commentId);
        let child = await getCommentById(commentId);
        child.setParentComment(this.props.uuid);
        await this.push();
    }

    removeChild = async (commentId) => {
        await this.updateComment();
        const index = this.props.childList.indexOf(commentId);
        if (index != -1) {
            let child = await getCommentById(commentId);
            child.setParentComment("dummy_parent");
            this.props.childList.splice(index, 1);
        }
        await this.push();
    }

    incrementScore = async () => {
        await this.updateComment();
        this.props.score = this.props.score + 1;
        await this.push();
    }

    decrementScore = async () => {
        await this.updateComment();
        this.props.score = this.props.score - 1;
        await this.push();
    }

    setEndorsed = async (newValue) => {
        this.props.isEndorsed = newValue;
        await this.push();
    }

    setAnonymous = async (newValue) => {
        this.props.isAnonymous = newValue;
        await this.push();
    }

    setResolved = async (newValue) => {
        this.props.isResolved = newValue;
        await this.push();
    }

    setContent = async (newContent) => {
        this.props.content = newContent;
        await this.push();
    }

    setParentComment = async (commentId) => {
        this.props.parentComment = commentId;
        await this.push();
    }
    /*
        sendUpdate = async () => {
            for (var i = 0; i < this.props.followingList.length; i ++) {
                const currUser = await user.getUserById(this.props.followingList[i]);
                const email = await currUser.getEmail();
                console.log(email)
                var transporter = nodemailer.createTransport({
                    host: "smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                      user: "60438c70e2cd80",
                      pass: "4320d95a84005b"
                    }
                  });
    
                var mailOptions = {
                    from: 'tagitcse110',
                    to: email,
                    subject: this.props.title + ' has been updated!',
                    // TODO: Need field for post url to add to updated email.
                    text: 'Check it out here'
                };
    
                await transporter.sendMail(mailOptions);
            }
        }
    */

    /**
     * Update a given post's data fields.
     *
     * @param updateParams - Object consisting of keys & values that will be updated for the user
     */
    push = async () => {
        try {
            await db.ref("Comments").child(this.props.uuid).set({
                content: this.props.content,
                author: this.props.author,
                uuid: this.props.uuid,
                time: this.props.time,
                postId: this.props.postId,
                parentComment: "parentComment" in this.props ? this.props.parentComment : "dummy_parent",
                score: this.props.score,
                childList: this.props.childList,
                isEndorsed: this.props.isEndorsed,
                isAnonymous: this.props.isAnonymous,
                isResolved: this.props.isResolved
            });
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports.pushCommentToFirebase = (updateParams) => {
    return new Promise(async (resolve, reject) => {
        try {
            const commentRef = db.ref("Comments").push();
            await commentRef.set({
                content: updateParams["content"],
                author: updateParams["author"],
                uuid: (await commentRef).key,
                time: Date.now(),
                postId: updateParams["postId"],
                parentComment: "parentComment" in updateParams ? updateParams["parentComment"] : "dummy_parent",
                score: 0,
                childList: ["dummy_child"],
                isEndorsed: "isEndorsed" in updateParams ? updateParams["isEndorsed"] : false,
                isAnonymous: "isAnonymous" in updateParams ? updateParams["isAnonymous"] : false,
                isResolved: false,

            });
            await ((await (User.getUserById(updateParams["author"]))).addComment((await commentRef).key));
            if (!updateParams["parentComment"]) {
                await ((await (Post.getPostById(updateParams["postId"]))).addComment((await commentRef).key));
            }
            resolve((await commentRef).key);
        } catch (e) {
            console.log("There was an error: " + e);
            reject("Something went wrong");
        }

    })
};



getCommentById = async (uuid) => {
    const ref = db.ref('Comments/' + uuid);
    return new Promise((resolve, reject) => {
        ref.once("value", function (snapshot) {
            //console.log(snapshot.val());
            const r = new Comment(snapshot.val());
            // now get the user's name
            //console.log(r);
            User.getUserById(r.getAuthor()).then(async user => {
                r.props.authorName = user.getName();
                r.props.likedStatus = await user.getLikedCommentStatus(uuid);

                resolve(r);
            }).catch(reject)
        }, function (errorObject) {
            reject(errorObject);
        })
    })
}

deleteCommentById = async (uuid) => {
    const ref = db.ref('Comments/'+uuid);
    // if comment has children
    const currentComment = await this.getCommentById(uuid);

    await currentComment.getChildList().forEach(async subUUID => {
        await this.deleteCommentById(subUUID);
    })

    // find the user who created me
    const currentUser = await User.getUserById(currentComment.getAuthor());
    await currentUser.removeComment(uuid);
    // find the post on which I am placed
    const currentPost = post.getPostById(currentComment.getPostId());
    await currentPost.removeComment(uuid);

    try{
        const result = await ref.remove();
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
    
}


module.exports.Comment = Comment
module.exports.getCommentById = getCommentById
module.exports.deleteCommentById = deleteCommentById
