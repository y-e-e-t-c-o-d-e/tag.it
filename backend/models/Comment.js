
// Install these dependencies before you run
const firebase = require("firebase");
const config = require("./firebaseConfig");
//const app = firebase.initializeApp(config);
const db = firebase.database();

class Comment {
    constructor(props) {
        this.props = props;
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

    getChildList() {
        return this.props.childList;
    }

    addChild = async (commentId) => {
        this.props.childList.push(commentId);
        let child = await getCommentById(commentId);
        child.setParentComment(this.props.uuid);
        await this.push();
    }

    incrementScore = async () => {
        this.props.score++;
        await this.push();
    }

    decrementScore = async () => {
        this.props.score--;
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
        await db.ref("Comments").child(this.props.uuid).set({
            content: this.props.content,
            author: this.props.author, 
            uuid: this.props.uuid,
            time: this.props.time,
            postId: this.props.postId,
            parentComment: this.props.parentComment,
            score: this.props.score,
            childList: this.props.childList,
            isEndorsed: this.props.isEndorsed,
            isAnonymous: this.props.isAnonymous,
            isResolved: this.props.isResolved
        });
    } 
}

module.exports.pushCommentToFirebase = (updateParams) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.ref("Comments").child(updateParams["uuid"]).set({
                content: updateParams["content"],
                author: updateParams["author"], 
                uuid: updateParams["uuid"],
                time: updateParams["time"],
                postId: updateParams["postId"],
                parentComment: updateParams["parentComment"],
                score: updateParams["score"],
                childList: updateParams["childList"],
                isEndorsed: updateParams["isEndorsed"],
                isAnonymous: updateParams["isAnonymous"],
                isResolved: updateParams["isResolved"],
            });
            resolve("Everything worked");
        } catch(e) {
            console.log("There was an error: " + e);
            reject("Something went wrong");
        }
        
    })
};



getCommentById = async (uuid) => {
    const ref = db.ref('Comments/' + uuid);

    return new Promise((resolve, reject) => {
        ref.once("value", function(snapshot) {
            const r = new Comment(snapshot.val());
            resolve(r);
        }, function (errorObject) {
            reject(errorObject);
        })
    }) 


    /**
     * This is for reference to the callback but, we're using promises now.
     */

    // // Attach an asynchronous callback to read the data at our posts reference
    // await ref.once("value", function(snapshot) {
    //     const r = new User(snapshot.val());
    //     console.log(r.props.name);
    //     callback(r);
    // }, function (errorObject) {
    //     console.log("The read failed: " + errorObject.code);
    // })
}

   
module.exports.Comment = Comment
module.exports.getCommentById = getCommentById
