const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const comment = require("../models/Comment");
const post = require("../models/Post");
const user = require("../models/User");
const { db } = require("../shared/firebase")

// User test suite 
describe('comment', () => {
    let commentKey;
    let testComment;
    let testPost;
    let userKey= db.ref("Users").push().key;
    let postKey;

    // Setup function before test is run 
    before(async () => {
        console.log("Setup for Comment Test Suite")
        // create user for testing comment
        const userParams = {
            name: "TEST",
            email: "g1@ucsd.edu",
            uuid: userKey
        }

        try {
            userKey = await user.pushUserToFirebase(userParams);
        } catch(e) {
            console.log(e);
        }

        // Create post for testing comment
        const postParams = {
            title: "i need help", 
            content: "TEST",
            author: userKey, 
            tagList: [],
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
            content: "TEST",
            author: userKey, 
            postId: postKey,
            isAnonymous : true
        }

        try {
            commentKey = await comment.pushCommentToFirebase(commentParams);
            testComment = await comment.getCommentById(commentKey);
        } catch(e) {
            console.log(e);
        }
    });

    // Teardown function after test is run 
    after(async () => {
        console.log("Teardown for Comment Test Suite");
        comment.deleteCommentById(commentKey);
        post.deletePostById(postKey);
        user.deleteUserById(userKey);
    });

    it('should get testComment Firebase', async () => {
        expect(testComment.props.author).to.equal(userKey);
    })

    it('should increment testComment score', async () => {
        await testComment.incrementScore();
        const t1 = await getCommentById(testComment.getUUID());
        expect(t1.getScore()).to.equal(1);
    })

    it('should find two equal comment models equal to eachother', async () => {
        const t2 = await comment.getCommentById(testComment.getUUID());
        expect(t2.equalTo(testComment)).to.equal(true);
    })

    it('should decrement testComment score', async () => {
        await testComment.decrementScore();
        expect(testComment.getScore()).to.equal(0);
    })

    it('should resolve testComment', async () => {
        await testComment.setResolved(true);
        expect(testComment.getResolved()).to.equal(true);
    })

    it('should update testComments content', async () => {
        testComment.setContent("yo this makes little to no sense");
        expect(testComment.getContent()).to.equal("yo this makes little to no sense");
    })

    it('should add replyComment to testComment childList', async () => {
        const replyCommentParams = {
            content: "agreed",
            author: userKey, 
            postId: "post1",
        }
        try {
            replyKey = await comment.pushCommentToFirebase(replyCommentParams);
            replyComment = await comment.getCommentById(replyKey);
        } catch(e) {
            console.log(e);
        }

        
        await testComment.addChild(replyKey);
        expect(testComment.getChildList().length).to.equal(1);
        await testComment.removeChild(replyKey);
        expect(testComment.getChildList().length).to.equal(0);
        await comment.deleteCommentById(replyKey);
    })
});