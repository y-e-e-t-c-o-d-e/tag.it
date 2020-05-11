const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const post = require("../models/Post");

// User test suite 
describe('post', () => {

    // Setup function before every test is run 
    beforeEach(() => {

    });

    // Teardown function after every test is run 
    afterEach(() => {

    });

    it('should create a new post in Firebase', async () => {
        const postParams = {
            title: "i need help", 
            content: "my code is broken",
            author: "user1", 
            uuid: "post1",
            tagList: ["tag1", "tag2"],
            commentList: ["comment1"],
            followingList: ["user1"],
            isAnnouncement: false,
            isPinned: false,
            isAnonymous: true,
            isPrivate: true,
            isResolved: false,
            isInstructor: false,
            score: 283,
            course: "course1"
        }

        try {
            const result = await post.pushPostToFirebase(postParams);
            expect(result).to.equal("Everything worked");
        } catch(e) {
            console.log(e);
        }  
    })
});