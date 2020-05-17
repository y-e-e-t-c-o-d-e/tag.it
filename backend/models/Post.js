
// Install these dependencies before you run
const nodemailer = require('nodemailer');
const user = require("./User");
const { db } = require("../shared/firebase")


class Post {
    constructor(props) {
        this.props = props;
    }

    /**
     * Update a given user's data fields.
     * 
     * @param updateParams - Object consisting of keys & values that will be updated for the user
     */
    getAuthor() {
        return this.props.author;
    }

    getTitle() {
        return this.props.title;
    }

    getUUID() {
        return this.props.uuid;
    }

    getUsersFollowing() {
        return this.props.followingList;
    }

    getComments() {
        return this.props.commentList;
    }

    getTagList() {
        return this.props.tagList;
    }

    getCommentList() {
        return commentList;
    }

    getCourse() {
        return this.props.course;
    }

    getScore() {
        return this.props.score;
    }

    getContent() {
        return this.props.content;
    }

    setTitle = async (newTitle) => {
        this.props.title = newTitle;
        await this.push();
    }

    addFollower = async (userId) => {
        this.props.followingList.push(userId);
        await this.push();
    }

    addComment = async (commentId) => {
        this.props.commentList.push(commentId);
        await this.push();
    }

    addTag = async (tagId) => {
        this.props.tagList.push(tagId);
        await this.push();
    }

    incrementScore = async () => {
        this.props.score++;
        await this.push();
    }

    setAnnouncement = async (newValue) => {
        this.props.isAnnouncement = newValue;
        await this.push();
    }

    setResolved = async (newValue) => {
        this.props.isResolved = newValue;
        await this.push();
    }

    setPinned = async (newValue) => {
        this.props.isPinned = newValue;
        await this.push();
    }

    setPrivate = async (newValue) => {
        this.props.isPrivate = newValue;
        await this.push();
    }

    setAnonymous = async (newValue) => {
        this.props.isAnonymous = newValue;
        await this.push();
    }

    setContent = async (newContent) => {
        this.props.content = newContent;
        await this.push();
    }

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

    removeTag = async (tagId) => {
        for (var i = 0; i < this.props.tagList.length; i ++) {
            if (this.props.tagList[i] === tagId) {
                this.props.tagList.splice(i, 1);
            }
        }
        await this.push();
    }



    /**
     * Update a given post's data fields.
     * 
     * @param updateParams - Object consisting of keys & values that will be updated for the user
     */
    push = async () => {
        await db.ref("Posts").child(this.props.uuid).set({
            title: this.props.title, 
            content: this.props.content,
            author: this.props.author, 
            uuid: this.props.uuid,
            tagList: this.props.tagList,
            commentList: this.props.commentList,
            followingList: this.props.followingList,
            isAnnouncement: this.props.isAnnouncement,
            isPinned: this.props.isPinned,
            isAnonymous: this.props.isAnonymous,
            isPrivate: this.props.isPrivate,
            isResolved: this.props.isResolved,
            isInstructor: this.props.isInstructor,
            score: this.props.score,
            course: this.props.course
        });
    } 
}

module.exports.pushPostToFirebase = (updateParams) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.ref("Posts").child(updateParams["uuid"]).set({
                title: updateParams["title"], 
                content: updateParams["content"],
                author: updateParams["author"], 
                uuid: updateParams["uuid"],
                tagList: updateParams["tagList"],
                commentList: updateParams["commentList"],
                followingList: updateParams["followingList"],
                isAnnouncement: updateParams["isAnnouncement"],
                isPinned: updateParams["isPinned"],
                isAnonymous: updateParams["isAnonymous"],
                isPrivate: updateParams["isPrivate"],
                isResolved: updateParams["isResolved"],
                isInstructor: updateParams["isInstructor"],
                score: updateParams["score"],
                course: updateParams["course"]
            });
            resolve("Everything worked");
        } catch(e) {
            console.log("There was an error: " + e);
            reject("Something went wrong");
        }
        
    })
};



getPostById = async (uuid) => {
    const ref = db.ref('Posts/' + uuid);

    return new Promise((resolve, reject) => {
        ref.once("value", function(snapshot) {
            const r = new Post(snapshot.val());
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

   
module.exports.Post = Post
module.exports.getPostById = getPostById
