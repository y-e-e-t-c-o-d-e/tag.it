const nodemailer = require('nodemailer');
const user = require("./User");
const tag = require("./Tag");
const comment = require("./Comment")
const { db } = require("../shared/firebase")
const course = require("./Course")

class Post {
    constructor(props) {
        this.props = props;
    }

        
    equalTo = (other) => {
        return (
            this.props.author === other.props.author &&
            this.props.title === other.props.title &&
            this.arraysEqual(this.props.commentList, other.props.commentList) &&
            this.arraysEqual(this.props.tagList, other.props.tagList) &&
            this.arraysEqual(this.props.followingList, other.props.followingList) &&
            this.props.content === other.props.content &&
            this.props.course === other.props.course&&
            this.props.isAnnouncement === other.props.isAnnouncement &&
            this.props.isAnonymous === other.props.isAnonymous &&
            this.props.isInstructor === other.props.isInstructor &&
            this.props.isPinned === other.props.isPinned &&
            this.props.isPrivate === other.props.isPrivate &&
            this.props.isResolved === other.props.isResolved &&
            this.props.score === other.props.score &&
            //this.props.time === other.props.time && I feel like its a bad idea to put time as a thing, that's always going to be different realistically.
            this.props.uuid === other.props.uuid
        )
    }

    
    arraysEqual = (a, b) => {
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

    updatePost = async () => {
        let other = await getPostById(this.props.uuid);
        while(!this.equalTo(other)) {
            this.props = other.props;
            other = await getPostById(this.props.uuid);
        }
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
        await this.updatePost();
        this.props.followingList.push(userId);
        await this.push();
    }
    removeFollower = async (userId) => {
        await this.updatePost();
        const index = this.props.followingList.indexOf(userId);
        if (index != -1) {
            this.props.followingList.splice(index, 1);
        }
        await this.push();
    }

    addComment = async (commentId) => {
        await this.updatePost();
        this.props.commentList.push(commentId);
        await this.push();
    }
    
    removeComment = async (commentId) => {
        await this.updatePost();
        const index = this.props.commentList.indexOf(commentId);
        if (index != -1) {
            this.props.commentList.splice(index, 1);
        }
        await this.push();
    }
    

    addTag = async (tagId) => {
        await this.updatePost();
        this.props.tagList.push(tagId);
        const addedTag = await tag.getTagById(tagId);
        await addedTag.addPost(this.props.uuid);
        await this.push();
    }

    // only removes the tag from the post list
    removeTag = async (tagId) => {
        await this.updatePost();
        const index = this.props.tagList.indexOf(tagId);
        if (index != -1) {
            this.props.tagList.splice(index, 1);
        }
        await this.push();
    }

    // deletes the tag itself
    deleteTag = async (tagId) => {
        const index = this.props.tagList.indexOf(tagId);
        if (index != -1) {
            this.props.tagList.splice(index, 1);
            const removedTag = await tag.getTagById(tagId);
            await removedTag.removePost(this.props.uuid);
        }
        await this.push();
    }

    incrementScore = async () => {
        await this.updatePost();
        this.props.score++;
        await this.push();
    }

    decrementScore = async() => {
        await this.updatePost();
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
            course: this.props.course,
            time: this.props.time
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
            const currentPost = await getPostById((await postRef).key);
            const course = await (Course.getCourseById(updateParams["course"]));
            await (course.addPost(currentPost.props.uuid));

            resolve((await postRef).key);
        } catch(e) {
            console.log("There was an error: " + e);
            reject(e);
        }
        
    })
};



getPostById = async (uuid, userObj) => {
    const ref = db.ref('Posts/' + uuid);

    return new Promise((resolve, reject) => {
        ref.once("value", function(snapshot) {
            let r = new Post(snapshot.val());
            if (!r) reject('No post by that id');
            if (!r.props.followingList) r.props.followingList = [];
            if (!r.props.tagList) r.props.tagList = ["dummy_tag"];

            if (userObj) {
                userObj.getLikedPostStatus().then((result) => {
                    r.props.likedStatus = result;
                    resolve(r);
                });
            } else {
                resolve(r);
            }
            
        }, function (errorObject) {
            reject(errorObject);
        })
    }) 
}

deletePostById = async (uuid) => {
    const ref = db.ref('Posts/'+uuid);
    const currentPost = await this.getPostById(uuid);
    const currentUser = await user.getUserById(currentPost.getAuthor());
    const currentCourse = await course.getCourseById(currentPost.getCourse());
    currentPost.getCommentList().forEach(commentUUID => {
        await comment.deleteCommentById(commentUUID);
    });
    await currentUser.removePost(uuid);
    await currentCourse.removePost(uuid);

    try{
        const result = await ref.remove();
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

   
module.exports.Post = Post
module.exports.getPostById = getPostById
module.exports.deletePostById = deletePostById
