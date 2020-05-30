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
            author: "user2", 
            postId: "post1",
            parentComment: "",
            isEndorsed: false,
            isAnonymous: true,
            isResolved: false
        }

        const replyComment = {
            content: "agreed",
            author: "user3", 
            uuid: "comment283",
            time: "05122020 15:55",
            postId: "post1",
            parentComment: "",
            score: 6,
            childList: [""],
            isEndorsed: false,
            isAnonymous: false,
            isResolved: false
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
        //comment.deleteCommentById(key);
    });

    it('should get testComment Firebase', async () => {
        expect(testComment.props.author).to.equal("user2");
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
            author: "user3", 
            postId: "post1",
            parentComment: "",
            isEndorsed: false,
            isAnonymous: false,
            isResolved: false
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




    /*
    it('should add comment to comments commentList', async () => {
        const uuid = 'comment1';
        const commentId = 'comment283';
        const testComment = await comment.getCommentById(uuid);

        await testComment.removeChild(commentId);
        //expect(testComment.props.content).to.equal("yo this makes no sense");

        //const replyTest = await comment.getCommentById(commentId);
        //expect(replyTest.props.parentComment).to.equal("comment1");
    })*/

    /*it('should modify comments content', async () => {
        const uuid = 'comment283';
        const testComment = await comment.getCommentById(uuid);
        await testComment.setContent("wait nvm this makes hella sense");
        expect(testComment.props.content).to.equal("wait nvm this makes hella sense");
    })*/

});