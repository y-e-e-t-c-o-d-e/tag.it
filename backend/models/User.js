const { db } = require("../shared/firebase")

class User {
    constructor(props) {
        this.props = props;
    }

    /**
     * Update a given user's data fields.
     * 
     * @param updateParams - Object consisting of keys & values that will be updated for the user
     */
    addStudentCourse = async (courseId) => {
        this.props.studentCourseList.push(courseId);
        await this.push();
    }

    addInstructorCourse = async (courseId) => {
        this.props.instructorCourseList.push(courseId);
        await this.push();
    }

    addPost = async (postId) => {
        this.props.postList.push(postId);
        await this.push();
    }

    addComment = async (commentId) => {
        this.props.commentList.push(commentId);
        await this.push();
    }

    addFollowedPost = async (postId) => {
        this.props.followingList.push(postId);
        await this.push();
    }

    addLikedPost = async (postId) => {
        this.props.likedPostList.push(postId);
        let post = await getPostById(postId);
        post.incrementScore();  // await?
        await this.push();
    }

    removeLikedPost = async (postId) => {
        this.props.likedPostList.splice(likedPostList.indexOf(postId), 1);
        let post = await getPostById(postId);
        post.decrementScore();  // await?
        await this.push();
    }

    addLikedComment = async (commentId) => {
        this.props.likedCommentList.push(commentId);
        let comment = await getCommentById(commentId);
        comment.incrementScore();  // await?
        await this.push();
    }

    removeLikedComment = async (commentId) => {
        this.props.likedCommentList.splice(likedCommentList.indexOf(commentId), 1);
        let comment = await getCommentById(commentId);
        comment.decrementScore();  // await?
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
            likedPostList: this.props.likedPostList,
            likedCommentList: this.props.likedCommentList,
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
            //console.log(r.props.name);
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

   
module.exports.User = User
module.exports.getUserById = getUserById