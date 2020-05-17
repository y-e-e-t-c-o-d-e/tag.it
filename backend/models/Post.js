// Install these dependencies before you run
const nodemailer = require('nodemailer');
const user = require("./User");
const tag = require("./Tag");
const comment = require("./Comment")
//const db = require("./firebase").db;
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

    getCommentList() {
        return this.props.commentList.slice(1, this.props.commentList.length);
    }

    getTagList() {
        if (this.props.tagList[0] == "dummy_tag") {
            return this.props.tagList.slice(1, this.props.tagList.length);
        }
        return this.props.tagList;
        
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

    getTime() {
        return this.props.time;
    }

    setTitle = async (newTitle) => {
        this.props.title = newTitle;
        await this.push();
    }

    addFollower = async (userId) => {
        this.props.followingList.push(userId);
        await this.push();
    }
    removeFollower = async (userId) => {
        const index = this.props.followingList.indexOf(userId);
        if (index != -1) {
            this.props.followingList.splice(index, 1);
        }
        await this.push();
    }

    addComment = async (commentId) => {
        this.props.commentList.push(commentId);
        await this.push();
    }
    
    removeComment = async (commentId) => {
        const index = this.props.commentList.indexOf(commentId);
        if (index != -1) {
            // may or may not be necessary depending on how front end implements deleteComment
            await comment.deleteCommentById(commentId);
            this.props.commentList.splice(index, 1);
        }
        await this.push();
    }
    

    addTag = async (tagId) => {
        this.props.tagList.push(tagId);
        const addedTag = await tag.getTagById(tagId);
        await addedTag.addPost(this.props.uuid);
        await this.push();
    }

    removeTag = async (tagId) => {
        const index = this.props.tagList.indexOf(tagId);
        if (index != -1) {
            this.props.tagList.splice(index, 1);
            const removedTag = await tag.getTagById(tagId);
            await removedTag.removePost(this.props.uuid);
        }
        await this.push();
    }

    incrementScore = async () => {
        this.props.score++;
        await this.push();
    }

    decrementScore = async() => {
        this.props.score--;
        await this.push();
    }

    isPrivate() {
        return this.props.isPrivate;
    }

    isPinned() {
        return this.props.isPinned;
    }

    isAnnouncement() {
        return this.props.isAnnouncement;
    }

    isResolved() {
        return this.props.isResolved;
    }

    isAnonymous() {
        return this.props.isAnonymous;
    }

    isInstructor() {
        return this.props.isInstructor;
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

    /*sendUpdate = async () => {
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
    }*/



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
            time: this.props.time,
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

//TODO: CREATE INITIAL POST

module.exports.pushPostToFirebase = (updateParams) => {
    return new Promise(async (resolve, reject) => {
        try {
            const postRef = db.ref("Posts").push();
            await (await postRef).set({
                title: updateParams["title"], 
                content: updateParams["content"],
                author: updateParams["author"], 
                uuid: (await postRef).key,
                time: Date.now(),
                tagList: "tagList" in updateParams ? updateParams["tagList"] : ["dummy_tag"],
                commentList: ['dummy_comment'],
                followingList: [updateParams["author"]],
                isAnnouncement: "isAnnouncement" in updateParams ? updateParams["isAnnouncement"] : false,
                isPinned: "isPinned" in updateParams ? updateParams["isPinned"] : false,
                isAnonymous: "isAnonymous" in updateParams ? updateParams["isAnonymous"] : false,
                isPrivate: "isPrivate" in updateParams ? updateParams["isPrivate"] : false,
                isResolved: false,
                isInstructor: "isInstructor" in updateParams ? updateParams["isInstructor"] : false,
                score: 0,
                course: updateParams["course"]
            });
            resolve((await postRef).key);
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
}

deletePostById = async (uuid) => {
    const ref = db.ref('Posts/'+uuid);
    ref.remove().then(function() {
        console.log("Remove succeeded.");
    }).catch(function(error) {
        console.log("Remove failed: " + error.message)
    });
}

   
module.exports.Post = Post
module.exports.getPostById = getPostById
module.exports.deletePostById = deletePostById
