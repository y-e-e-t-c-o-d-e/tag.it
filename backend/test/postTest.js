const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const post = require("../models/Post");
const user = require("../models/User");
const comment = require("../models/Comment");
const tag = require("../models/Tag");

// User test suite 
describe('post', async () => {
    let key;
    let testPost;


    // Setup function before test is run 
    before(async () => {
        console.log("Setup for Post Test Suite")
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
            key = await post.pushPostToFirebase(postParams);
            testPost = await post.getPostById(key);
        } catch(e) {
            console.log(e);
        }
    });

    // Teardown function after test is run 
    after(async () => {
        console.log("Teardown for Post Test Suite");
        post.deletePostById(key);
    });

    it('should get testPost from Firebase', async () => {
        expect(testPost.props.course).to.equal("course1");  
    })

    it('should get and set title of post in firebase', async() => {
        expect(testPost.getTitle()).to.equal("i need help");
        testPost.setTitle("I am a buffoon");
        expect(testPost.getTitle()).to.equal("I am a buffoon");
    })

    it('should add and remove follower of post in firebase', async() => {
        expect(testPost.getUsersFollowing().length).to.equal(1);
        testPost.addFollower('user2');
        expect(testPost.getUsersFollowing().length).to.equal(2);
        testPost.addFollower('user3');
        testPost.removeFollower('user3');
        expect(testPost.getUsersFollowing().length).to.equal(2);
    })

    it('should add and remove comment of post in firebase', async() => {
        let commentKey;
        const commentParams = {
            content: "yo this makes no sense",
            author: "user2", 
            postId: key,
            isAnonymous : true
        }

        try {
            commentKey = await comment.pushCommentToFirebase(commentParams);
        } catch(e) {
            console.log(e);
        }

        expect(testPost.getCommentList().length).to.equal(0);
        testPost.addComment('comment1');
        expect(testPost.getCommentList().length).to.equal(1);
        testPost.addComment(commentKey);
        await testPost.removeComment(commentKey);
        expect(testPost.getCommentList().length).to.equal(1);
        await comment.deleteCommentById(commentKey);
    })

    it('should add and remove tag of post in firebase', async() => {
        expect(testPost.getTagList().length).to.equal(2);
        let tagKey;
        let testTag;
        const tagParams = {
            name: "pa1", 
            numUsed: "3",
            parentTag: "dummy_parent", 
            subTags: ["dummy_tag"],
            course: "course1",
            postList: ["dummy_post"],
        }

        try {
            tagKey = await tag.pushTagToFirebase(tagParams);
            testTag = await tag.getTagById(tagKey);
        } catch(e) {
            console.log(e);
        }
        await testPost.addTag(tagKey);
        expect(testPost.getTagList().length).to.equal(3);
        await testPost.removeTag(tagKey);
        expect(testPost.getTagList().length).to.equal(2);
        tag.deleteTagById(tagKey);
    })

    // This test will not send the email, since Node returns before finishing the call. How to fix, idk.
    /*it('should send an email to the user from us', async () => {
        const testPost = await post.getPostById('post1');
        await testPost.sendUpdate();
        expect(testPost.props.uuid).to.equal("post1");
    })*/
});