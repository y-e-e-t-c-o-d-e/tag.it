const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const user = require("../models/User");
const post = require("../models/Post");
const comment = require("../models/Comment");
const tag = require("../models/Tag");
const course = require("../models/Course");
const { db } = require("../shared/firebase")

// User test suite 
describe('user', () => {
    let key = db.ref("Users").push().key;
    let testUser;

    // Setup function before test is run 
    before(async () => {
        console.log("Setup for User Test Suite")
        const userParams = {
            name: "gary",
            email: "g1@ucsd.edu",
            uuid: key
        }

        try {
            const yeet = await user.pushUserToFirebase(userParams);
            testUser = await user.getUserById(yeet);
        } catch(e) {
            console.log(e);
        }
    });

    // Teardown function after test is run 
    after(async () => {
        console.log("Teardown for User Test Suite");
        user.deleteUserById(key)
    });

    it('should get user from firebase', async() => {
        expect(testUser.props.name).to.equal("gary"); 
    })
    

    it('should add and remove course from user studentCourseList', async () => {
        const testCourseID = 'cse110';
        await testUser.addStudentCourse(testCourseID);
        expect(testUser.getStudentCourseList().length).to.equal(1);
        await testUser.removeStudentCourse(testCourseID);
        expect(testUser.getStudentCourseList().length).to.equal(0);
    });

    it('should add and remove course from user instructorCourseList', async () => {
        const testCourseID = 'cse11';
        await testUser.addInstructorCourse(testCourseID);
        expect(testUser.getInstructorCourseList().length).to.equal(1);
        await testUser.removeInstructorCourse(testCourseID);
        expect(testUser.getInstructorCourseList().length).to.equal(0);
    })

    it('should add and remove post from user postList', async () => {
        let postKey;
        let testPost;
        const postParams = {
            title: "i need help", 
            content: "my code is broken",
            author: "user1", 
            tagList: ["tag1", "tag2"],
            isAnnouncement: true,
            isPinned: true,
            isAnonymous: true,
            isPrivate: false,
            isInstructor: false,
            course: "course1"
        }
        try {
            postKey = await post.pushPostToFirebase(postParams);
            testPost = await post.getPostById(postKey);
        } catch(e) {
            console.log(e);
        }
        await testUser.addPost(postKey);
        expect(testUser.getPostList().length).to.equal(1);
        await testUser.removePost(postKey);
        expect(testUser.getPostList().length).to.equal(0);
    })

    it('should add and remove comment from user commentList', async () => {
        let commentKey;
        let postKey;
        let testPost;

        const postParams = {
            title: "i need help", 
            content: "my code is broken",
            author: "user1", 
            tagList: ["tag1", "tag2"],
            isAnnouncement: true,
            isPinned: true,
            isAnonymous: true,
            isPrivate: false,
            isInstructor: false,
            course: "course1"
        }
        try {
            postKey = await post.pushPostToFirebase(postParams);
            testPost = await post.getPostById(postKey);
        } catch(e) {
            console.log(e);
        }

        const commentParams = {
            content: "yo this makes no sense",
            author: "user2", 
            postId: postKey,
            isAnonymous : true
        }

        try {
            commentKey = await comment.pushCommentToFirebase(commentParams);
        } catch(e) {
            console.log(e);
        }

        await testUser.addComment(commentKey);
        await testPost.addComment(commentKey);
        expect(testUser.getCommentList().length).to.equal(1);
        await testUser.removeComment(commentKey);
        await testPost.removeComment(commentKey);
        expect(testUser.getCommentList().length).to.equal(0);
        await post.deletePostById(testPost.getUUID());
    })

    it('should follow and unfollow post', async () => {
        let postKey;
        const postParams = {
            title: "i need help", 
            content: "my code is broken",
            author: "user1", 
            tagList: ["tag1", "tag2"],
            isAnnouncement: true,
            isPinned: true,
            isAnonymous: true,
            isPrivate: false,
            isInstructor: false,
            course: "course1"
        }
        try {
            postKey = await post.pushPostToFirebase(postParams);
        } catch(e) {
            console.log(e);
        }
        await testUser.addFollowedPost(postKey);
        expect(testUser.getFollowingList().length).to.equal(1);

        await testUser.removeFollowedPost(postKey);
        expect(testUser.getFollowingList().length).to.equal(0);
        await post.deletePostById(postKey);
    })

});

// gotta make sure all the posts and comments and courses are real