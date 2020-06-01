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
    }

    setEmail = async (email) => {
        this.props.email = email;
    }
    
    removeStudentCourse = async (courseId) => {
        await this.updateUser();
        const index = this.props.studentCourseList.indexOf(courseId);
        if (index != -1) {
            // is this where i handle removing self from course's studentList?
            this.props.studentCourseList.splice(index, 1);
        }
        await this.push();
    }


    addInstructorCourse = async (courseId) => {
        await this.updateUser();
        // Avoid adding duplicates
        if (this.props.instructorCourseList.indexOf(courseId) < 0) {
            this.props.instructorCourseList.push(courseId);
            const currentCourse = await course.getCourseById(courseId);
            await currentCourse.addInstructor(this.props.uuid, this.props.email);
            await this.push();
        } else {
            throw new InternalServerError(`Instructor Course ${courseId} already exists.`);
        }
    }

    removeInstructorCourse = async (courseId) => {
        await this.updateUser();
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


    updateStudentCourses = async () => {
        let user = await getUserById(this.props.uuid);
        while(!this.arraysEqual(this.props.studentCourseList, user.props.studentCourseList)) {
            this.props.studentCourseList = tag.props.studentCourseList;
            user = await getUserById(this.props.uuid);
        }
    }

    addStudentCourse = async (courseId) => {
        await this.updateStudentCourses();
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
        await this.updateInstructorCourses();
        // Avoid adding duplicates
        if (this.props.instructorCourseList.indexOf(courseId) < 0) {
            this.props.instructorCourseList.push(courseId);
            await this.push();
        } else {
            throw new InternalServerError(`Instructor Course ${courseId} already exists.`);
        }
    }

    removeInstructorCourse = async (courseId) => {
        await this.updateInstructorCourses();
        
        if (this.props.instructorCourseList.indexOf(courseId) >= 0) {
            this.props.instructorCourseList.splice(this.props.instructorCourseList.indexOf(courseId), 1);
            await this.push();
        }
    }

    removeStudentCourse = async (courseId) => {
        await this.updateStudentCourses();
        
        if (this.props.studentCourseList.indexOf(courseId) >= 0) {
            this.props.studentCourseList.splice(this.props.studentCourseList.indexOf(courseId), 1);
            await this.push();
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
        await this.updatePosts();
        this.props.postList.push(postId);
        await this.push();
    }

    removePost = async (postId) => {
        await this.updateUser();
        const index = this.props.postList.indexOf(postId);
        if (index != -1) {
            await post.deletePostById(postId);
            this.props.postList.splice(index, 1);
        }
        await this.push();
    }

    addComment = async (commentId) => {
        await this.updateUser();
        this.props.commentList.push(commentId);
        await this.push();
    }

    removeComment = async (commentId) => {
        await this.updateUser();
        const index = this.props.commentList.indexOf(commentId);
        if (index != -1) {
            this.props.commentList.splice(index, 1);
        }
        await this.push();
    }

    addFollowedPost = async (postId) => {
        await this.updateUser();
        this.props.followingList.push(postId);
        const currentPost = await post.getPostById(postId);
        await currentPost.addFollower(this.props.uuid);
        await this.push();
    }

    removeFollowedPost = async (postId) => {
        await this.updateUser();
        const index = this.props.followingList.indexOf(postId);
        if (index != -1) {
            const currentPost = await post.getPostById(postId);
            await currentPost.removeFollower(this.props.uuid);
            this.props.followingList.splice(index, 1);
        }
        await this.push();
    }
        
    addLikedPost = async (postId) => {
        await this.updateUser();
        this.props.likedPostList.push(postId);
        let postObj = await post.getPostById(postId);
        await postObj.incrementScore();
        await this.push();
    }

    removeLikedPost = async (postId) => {
        await this.updateUser();
        this.props.likedPostList.splice(this.props.likedPostList.indexOf(postId), 1);
        let postObj = await post.getPostById(postId);
        await postObj.decrementScore();
        await this.push();
    }

    addLikedComment = async (commentId) => {
        await this.updateUser();
        this.props.likedCommentList.push(commentId);
        let commentObj = await comment.getCommentById(commentId);
        commentObj.incrementScore();
        await this.push();
    }

    removeLikedComment = async (commentId) => {
        await this.updateUser();
        this.props.likedCommentList.splice(this.props.likedCommentList.indexOf(commentId), 1);
        let commentObj = await comment.getCommentById(commentId);
        commentObj.decrementScore();
        await this.push();
    }

    getLikedCommentStatus = async (commentId) => {
        await this.updateUser();
        console.log(commentId);
        console.log(this.getLikedCommentList())
        return this.getLikedCommentList().indexOf(commentId) >= 0;
    }
    
    setIcon = async (icon) => {
        this.props.icon = icon;
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
    const ref = db.ref('Users/'+uuid);
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
