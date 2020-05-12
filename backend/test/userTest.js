const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const user = require("../models/User");

// User test suite 
describe('user', () => {

    // Setup function before every test is run 
    beforeEach(() => {

    });

    // Teardown function after every test is run 
    afterEach(() => {

    });
/*
    it('should succeed and get user info given uuid', async () => {
        //const {name} = await user.getUser('some UUID');
        expect(name).to.equal("tag.it");
    });

    it('should succeed and push user to firebase given info', async() => {
        const userParams = {
            name: "gary",
            email: "g1@ucsd.edu",
            uuid: "user1"
        }
        try {
            //const result = await user.pushUserToFirebase(userParams);
            //var result = "Something went wrong";
            //const result = await user.pushUserToFirebase(userParams);
            console.log(result);
            expect(result).to.equal("Everything worked");
        } catch(e) {

        }    
    })
    

    it('should add course to user studentCourseList', async () => {
        const uuid = 'user1';
        // await user.getUserById(uuid, async (value) => {
        //     const testUser = value
        //     console.log(testUser.props.name);
        //     const testCourseID = 'cse110';
        //     await testUser.addCourse(testCourseID);
        //     expect(true).to.equal(true);
        // });

        const testUser = await user.getUserById(uuid)
        const testCourseID = 'cse110';
        await testUser.addStudentCourse(testCourseID);
        expect(testUser.props.name).to.equal('gary');
        
    })

    it('should add course to user instructorCourseList', async () => {
        const uuid = 'user1';
        const testUser = await user.getUserById(uuid)
        const testCourseID = 'cse101';
        await testUser.addInstructorCourse(testCourseID);
        expect(testUser.props.name).to.equal('gary');
        
    })

    it('should add a post to user postList', async () => {
        const uuid = 'user1';
        const testUser = await user.getUserById(uuid)
        const testPostID = 'post1';
        await testUser.addPost(testPostID);
        expect(testUser.props.name).to.equal('gary');
    })

    it('should add a comment to user commentList', async () => {
        const uuid = 'user1';
        const testUser = await user.getUserById(uuid)
        const testCommentID = 'comment1';
        await testUser.addComment(testCommentID);
        expect(testUser.props.name).to.equal('gary');
    })

    it('should add a followed post to user followingList', async () => {
        const uuid = 'user1';
        const testUser = await user.getUserById(uuid)
        const testFollowedPostID = 'followedPost1';
        await testUser.addFollowedPost(testFollowedPostID);
        expect(testUser.props.name).to.equal('gary');
    })*/
});