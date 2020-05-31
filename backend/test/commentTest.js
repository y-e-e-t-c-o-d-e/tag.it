const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const comment = require("../models/Comment");

// User test suite 
describe('comment', () => {
    let key;
    let testComment;

    // Setup function before test is run 
    before(async () => {
        console.log("Setup for Comment Test Suite")
        const commentParams = {
            content: "yo this makes no sense",
            author: "user1", 
            postId: "post1",
            isAnonymous : true
        }

        try {
            key = await comment.pushCommentToFirebase(commentParams);
            testComment = await comment.getCommentById(key);
        } catch(e) {
            console.log(e);
        }
    });

    // Teardown function after test is run 
    after(async () => {
        console.log("Teardown for Comment Test Suite");
        comment.deleteCommentById(key);
    });

    it('should get testComment Firebase', async () => {
        expect(testComment.props.author).to.equal("user1");
    })

    it('should increment testComment score', async () => {
        testComment.incrementScore();
        expect(testComment.getScore()).to.equal(1);
    })

    it('should decrement testComment score', async () => {
        testComment.decrementScore();
        expect(testComment.getScore()).to.equal(0);
    })

    it('should resolve testComment', async () => {
        testComment.setResolved(true);
        expect(testComment.getResolved()).to.equal(true);
    })

    it('should update testComments content', async () => {
        testComment.setContent("yo this makes little to no sense");
        expect(testComment.getContent()).to.equal("yo this makes little to no sense");
    })

    it('should add replyComment to testComment childList', async () => {
        const replyCommentParams = {
            content: "agreed",
            author: "User1", 
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
        comment.deleteCommentById(replyKey);
    })
});