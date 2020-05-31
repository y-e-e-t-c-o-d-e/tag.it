const post = require("./Post");
const tag = require("./Tag");
const course = require("./Course")
const { db } = require("../shared/firebase");
const { InternalServerError } = require("../shared/error");
const comment = require("./Comment");

class User {
    constructor(props) {
        this.props = props;
    }

    /**
     * Update a given user's data fields.
     * 
     * @param updateParams - Object consisting of keys & values that will be updated for the user
     */
    setName = async (name) => {
        this.props.name = name;
    }
    
    addStudentCourse = async (courseId) => {
        this.props.studentCourseList.push(courseId);
        const currentCourse = course.getCourseById(courseId);
        //await currentCourse.addStudent(this.props.uuid);
        await this.push();
    }

    setEmail = async (email) => {
        this.props.email = email;
    }
    
    removeStudentCourse = async (courseId) => {
        const index = this.props.studentCourseList.indexOf(courseId);
        if (index != -1) {
            // is this where i handle removing self from course's studentList?
            this.props.studentCourseList.splice(index, 1);
        }
        await this.push();
    }

    addStudentCourse = async (courseId) => {
        // Avoid adding duplicates
        if (this.props.studentCourseList.indexOf(courseId) < 0) {
            this.props.studentCourseList.push(courseId);
            const currentCourse = course.getCourseById(courseId);
            //await currentCourse.addStudent(this.props.uuid);
            await this.push();
        } else {
            throw new InternalServerError(`Student Course ${courseId} already exists.`);
        }
    }

    removeStudentCourse = async (courseId) => {
        const index = this.props.studentCourseList.indexOf(courseId);
        if (index != -1) {
            // is this where i handle removing self from course's studentList?
            this.props.studentCourseList.splice(index, 1);
        }
        await this.push();
    }

    addInstructorCourse = async (courseId) => {
        // Avoid adding duplicates
        if (this.props.instructorCourseList.indexOf(courseId) < 0) {
            this.props.instructorCourseList.push(courseId);
            const currentCourse = course.getCourseById(courseId);
            //await currentCourse.addInstructor(this.props.uuid);
            await this.push();
        } else {
            throw new InternalServerError(`Instructor Course ${courseId} already exists.`);
        }
    }
    
    removeInstructorCourse = async (courseId) => {
        const index = this.props.instructorCourseList.indexOf(courseId);
        if (index != -1) {
            // is this where i handle removing self from course's studentList?
            this.props.instructorCourseList.splice(index, 1);
        }
    }

    removeInstructorCourse = async (courseId) => {
        const index = this.props.instructorCourseList.indexOf(courseId);
        if (index != -1) {
            // is this where i handle removing self from course's studentList?
            this.props.instructorCourseList.splice(index, 1);
        }
        await this.push();
    }

    setEmail = async (email) => {
        this.props.email = email;
        await this.push();
    }

    addStudentCourse = async (courseId) => {
        // Avoid adding duplicates
        if (this.props.studentCourseList.indexOf(courseId) < 0) {
            this.props.studentCourseList.push(courseId);
            await this.push();
        } else {
            throw new InternalServerError(`Student Course ${courseId} already exists.`);
        }
        
    }

    addInstructorCourse = async (courseId) => {
        // Avoid adding duplicates
        if (this.props.instructorCourseList.indexOf(courseId) < 0) {
            this.props.instructorCourseList.push(courseId);
            await this.push();
        } else {
            throw new InternalServerError(`Instructor Course ${courseId} already exists.`);
        }
    }

    addPost = async (postId) => {
        this.props.postList.push(postId);
        await this.push();
    }

    removePost = async (postId) => {
        const index = this.props.postList.indexOf(postId);
        if (index != -1) {
            await post.deletePostById(postId);
            this.props.postList.splice(index, 1);
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
            this.props.commentList.splice(index, 1);
        }
        await this.push();
    }

    addFollowedPost = async (postId) => {
        this.props.followingList.push(postId);
        const currentPost = await post.getPostById(postId);
        await currentPost.addFollower(this.props.uuid);
        await this.push();
    }

    removeFollowedPost = async (postId) => {
        const index = this.props.followingList.indexOf(postId);
        if (index != -1) {
            const currentPost = await post.getPostById(postId);
            await currentPost.removeFollower(this.props.uuid);
            this.props.followingList.splice(index, 1);
        }
        await this.push();
    }
        
    addLikedPost = async (postId) => {
        this.props.likedPostList.push(postId);
        let postObj = await post.getPostById(postId);
        postObj.incrementScore();
        await this.push();
    }

    removeLikedPost = async (postId) => {
        this.props.likedPostList.splice(this.props.likedPostList.indexOf(postId), 1);
        let postObj = await post.getPostById(postId);
        postObj.decrementScore();
        await this.push();
    }

    addLikedComment = async (commentId) => {
        this.props.likedCommentList.push(commentId);
        let commentObj = await comment.getCommentById(commentId);
        commentObj.incrementScore();
        await this.push();
    }

    removeLikedComment = async (commentId) => {
        this.props.likedCommentList.splice(this.props.likedCommentList.indexOf(commentId), 1);
        let commentObj = await comment.getCommentById(commentId);
        commentObj.decrementScore();
        await this.push();
    }
    
    setIcon = async (icon) => {
        this.props.icon = icon;
    }
    
    removeFollowedPost = async (postId) => {
        const index = this.props.followingList.indexOf(postId);
        if (index != -1) {
            const currentPost = await post.getPostById(postId);
            await currentPost.removeFollower(this.props.uuid);
            this.props.followingList.splice(index, 1);
        }
        await this.push();
    }

    addLikedPost = async (postId) => {
        this.props.likedPostList.push(postId);
        let postObj = await post.getPostById(postId);
        postObj.incrementScore();
        await this.push();
    }

    removeLikedPost = async (postId) => {
        this.props.likedPostList.splice(this.props.likedPostList.indexOf(postId), 1);
        let postObj = await post.getPostById(postId);
        postObj.decrementScore();
        await this.push();
    }

    addLikedComment = async (commentId) => {
        this.props.likedCommentList.push(commentId);
        let commentObj = await comment.getCommentById(commentId);
        commentObj.incrementScore();
        await this.push();
    }

    removeLikedComment = async (commentId) => {
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
     * Update a given user's data fields.
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
    const name = updateParams['name'];
    const email = updateParams['email'];
    const uuid = updateParams['uuid'];
    return new Promise(async (resolve, reject) => {
        try {
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
            resolve(updateParams['uuid']);
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
}


deleteUserById = async (uuid) => {
    const ref = db.ref('Comments/'+uuid);
    try{
        const result = await ref.remove();
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}
   
module.exports.User = User
module.exports.getUserById = getUserById
module.exports.deleteUserById = deleteUserById
