const { db } = require("../shared/firebase");
const { InternalServerError } = require("../shared/error");
const post = require("./Post");
const comment = require("./Comment");

class User {
    constructor(props) {
        this.props = props;
    }

    equalTo = (otherUser) => {
        return (
            this.arraysEqual(this.props.commentList, otherUser.props.commentList) &&
            this.arraysEqual(this.props.followingList, otherUser.props.followingList) &&
            this.arraysEqual(this.props.instructorCourseList, otherUser.props.instructorCourseList) &&
            this.arraysEqual(this.props.postList, otherUser.props.postList) &&
            this.arraysEqual(this.props.studentCourseList, otherUser.props.studentCourseList) &&
            this.props.email === otherUser.props.email &&
            this.props.uuid === otherUser.props.uuid &&
            this.props.icon === otherUser.props.icon &&
            this.props.name === otherUser.props.name
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

    updateUser = async () => {
        let user = await getUserById(this.props.uuid);
        while(!this.equalTo(user)) {
            this.props = user.props;
            user = await getUserById(this.props.uuid);
        }
    }

    /**
     * Update a given user's data fields.
     * 
     * @param updateParams - Object consisting of keys & values that will be updated for the user
     */
    setName = async (name) => {
        this.props.name = name;
        await this.push();
    }

    setEmail = async (email) => {
        this.props.email = email;
        await this.push();
    }


    updateStudentCourses = async () => {
        let user = await getUserById(this.props.uuid);
        while(!this.arraysEqual(this.props.studentCourseList, user.props.studentCourseList)) {
            this.props.studentCourseList = tag.props.studentCourseList;
            user = await getUserById(this.props.uuid);
        }
    }

    addStudentCourse = async (courseId) => {
        this.updateStudentCourses();
        // Avoid adding duplicates
        if (this.props.studentCourseList.indexOf(courseId) < 0) {
            this.props.studentCourseList.push(courseId);
            await this.push();
        } else {
            // I don't know if this should throw an error, unless we want frontend to catch it.
            // I think it should just return failure
            throw new InternalServerError(`Student Course ${courseId} already exists.`);
        }
        
    }

    updateInstructorCourses = async () => {
        let user = await getUserById(this.props.uuid);
        while(!this.arraysEqual(this.props.instructorCourseList, user.props.instructorCourseList)) {
            this.props.instructorCourseList = tag.props.instructorCourseList;
            user = await getUserById(this.props.uuid);
        }
    }

    addInstructorCourse = async (courseId) => {
        this.updateInstructorCourses();
        // Avoid adding duplicates
        if (this.props.instructorCourseList.indexOf(courseId) < 0) {
            this.props.instructorCourseList.push(courseId);
            await this.push();
        } else {
            throw new InternalServerError(`Instructor Course ${courseId} already exists.`);
        }
    }

    updatePosts = async () => {
        let user = await getUserById(this.props.uuid);
        while(!this.arraysEqual(this.props.postList, user.props.postList)) {
            this.props.postList = tag.props.postList;
            user = await getUserById(this.props.uuid);
        }
    }
    
    addPost = async (postId) => {
        this.updatePosts();
        this.props.postList.push(postId);
        await this.push();
    }

    updateComments = async () => {
        let user = await getUserById(this.props.uuid);
        while(!this.arraysEqual(this.props.commentList, user.props.commentList)) {
            this.props.commentList = tag.props.commentList;
            user = await getUserById(this.props.uuid);
        }
    }

    addComment = async (commentId) => {
        this.updateComments();
        this.props.commentList.push(commentId);
        await this.push();
    }

    updateComments = async () => {
        let user = await getUserById(this.props.uuid);
        while(!this.arraysEqual(this.props.commentList, user.props.commentList)) {
            this.props.commentList = tag.props.commentList;
            user = await getUserById(this.props.uuid);
        }
    }

    addFollowedPost = async (postId) => {
        this.updateUser();
        this.props.followingList.push(postId);
        await this.push();
    }

    addLikedPost = async (postId) => {
        this.updateUser();
        this.props.likedPostList.push(postId);
        let postObj = await post.getPostById(postId);
        postObj.incrementScore();
        await this.push();
    }

    removeLikedPost = async (postId) => {
        this.updateUser();
        this.props.likedPostList.splice(this.props.likedPostList.indexOf(postId), 1);
        let postObj = await post.getPostById(postId);
        postObj.decrementScore();
        await this.push();
    }

    addLikedComment = async (commentId) => {
        this.updateUser();
        this.props.likedCommentList.push(commentId);
        let commentObj = await comment.getCommentById(commentId);
        commentObj.incrementScore();
        await this.push();
    }

    removeLikedComment = async (commentId) => {
        this.updateUser();
        this.props.likedCommentList.splice(this.props.likedCommentList.indexOf(commentId), 1);
        let commentObj = await comment.getCommentById(commentId);
        commentObj.decrementScore();
        await this.push();
    }
    
    setIcon = async (icon) => {
        this.props.icon = icon;
        await this.push();
    }

    getName() {
        return this.props.name;
    }

    getEmail() {
        return this.props.email;
    }

    getUUID() {
        return this.props.uuid;
    }

    getStudentCourseList() {
        return this.props.studentCourseList.slice(1, this.props.studentCourseList.length);
    }

    getInstructorCourseList() {
        return this.props.instructorCourseList.slice(1, this.props.instructorCourseList.length);
    }

    getPostList() {
        return this.props.postList.slice(1, this.props.postList.length);
    }

    getCommentList() {
        return this.props.commentList.slice(1, this.props.commentList.length);
    }

    getFollowingList() {
        return this.props.followingList.slice(1, this.props.followingList.length);
    }

    getLikedPostList() {
        return this.props.likedPostList.slice(1, this.props.likedPostList.length);
    }

    getLikedCommentList() {
        return this.props.likedCommentList.slice(1, this.props.likedCommentList.length);
    }

    getIcon() {
        return this.props.icon;
    }
 
    //getters for everything, add post, add comment, add followedPost

    /**
     * Uupdate a given user's data fields.
     * 
     * @param updateParams - Object consisting of keys & values that will be updated for the user
     */
    push = async () => {
        await db.ref("Users").child(this.props.uuid).set({
            name: this.props.name, 
            email: this.props.email, 
            uuid: this.props.uuid, 
            studentCourseList: this.props.studentCourseList,
            instructorCourseList: this.props.instructorCourseList,
            postList: this.props.postList,
            commentList: this.props.commentList,
            followingList: this.props.followingList,
            // Add this ternary for new fields to prevent old data from crashing
            likedPostList: this.props.likedPostList ? this.props.likedPostList : [],
            likedCommentList: this.props.likedCommentList ? this.props.likedCommentList : [],
            icon: this.props.icon
        });
    } 
}

module.exports.pushUserToFirebase = (updateParams) => {
    var name = updateParams['name'];
    var email = updateParams['email'];
    var uuid = updateParams['uuid'];
    return new Promise(async (resolve, reject) => {
        try {
            // TODO: Implement logic for these lists later.
            await db.ref("Users").child(uuid).set({
                name: name, 
                email: email, 
                uuid: uuid, 
                studentCourseList: ["dummy_course_id"], 
                instructorCourseList: ["dummy_course_id"],
                postList: ["dummy_post_id"],
                commentList: ["dummy_comment_id"],
                followingList: ["dummy_post_id"],
                likedPostList: ["dummy_post_id"],
                likedCommentList: ["dummy_comment_id"],
                icon: "anonymous.jpg"
            });
            resolve("Everything worked");
        } catch(e) {
            console.log("There was an error: " + e);
            reject("Something went wrong");
        }
    })
};



getUserById = async (uuid) => {
    const ref = db.ref('Users/' + uuid);


    return new Promise((resolve, reject) => {
        ref.once("value", function(snapshot) {
            const r = new User(snapshot.val());
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

deleteUserByID = async (uuid) => {
    //console.log("yeet")
    const ref = db.ref('Users/' + uuid);
    ref.remove()
    .then(function() {
        console.log("Remove succeeded.")
      })
      .catch(function(error) {
        console.log("Remove failed: " + error.message)
      });

    // return new Promise((resolve, reject) => {
    //     ref.once("value", function(snapshot) {
    //         ref.remove()
    //         resolve()
    //     }, function (errorObject) {
    //         reject(errorObject);
    //     })
    // })  
}

   
module.exports.User = User
module.exports.getUserById = getUserById
module.exports.deleteUserByID = deleteUserByID