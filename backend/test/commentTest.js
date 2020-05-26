const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const comment = require("../models/Comment");

// User test suite 
describe('comment', () => {

    // Setup function before every test is run 
    beforeEach(() => {

    });

    // Teardown function after every test is run 
    afterEach(() => {

    });

    /*it('should create a new comment in Firebase', async () => {
        const commentParams = {
            content: "yo this makes no sense",
            author: "user2", 
            uuid: "comment1",
            time: "05122020 14:33",
            postId: "post1",
            parentComment: "",
            score: 12,
            childList: ["comment2", "comment4"],
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
            const result = await comment.pushCommentToFirebase(commentParams);
            expect(result).to.equal("Everything worked");

            const replyResult = await comment.pushCommentToFirebase(replyComment);
            expect(replyResult).to.equal("Everything worked");
            //expect(1).to.equal(1);
        } catch(e) {
            console.log(e);
        }  
    })

    it('should get comment from firebase', async () => {
        const uuid = 'comment1';
        const testComment = await comment.getCommentById(uuid);
        expect(testComment.props.content).to.equal("yo this makes no sense");
    })*/

    it('should add comment to comments commentList', async () => {
        const uuid = 'comment1';
        const commentId = 'comment283';
        const testComment = await comment.getCommentById(uuid);

        await testComment.removeChild(commentId);
        //expect(testComment.props.content).to.equal("yo this makes no sense");

        //const replyTest = await comment.getCommentById(commentId);
        //expect(replyTest.props.parentComment).to.equal("comment1");
    })

    /*it('should modify comments content', async () => {
        const uuid = 'comment283';
        const testComment = await comment.getCommentById(uuid);
        await testComment.setContent("wait nvm this makes hella sense");
        expect(testComment.props.content).to.equal("wait nvm this makes hella sense");
    })*/

});