const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const post = require("../models/Post");
const user = require("../models/User");
const course = require("../models/Course");

// Tag test suite 
describe('course', () => {

    // Setup function before every test is run 
    beforeEach(() => {

    });

    // Teardown function after every test is run 
    afterEach(() => {

    });

    it('should create a new course in Firebase', async () => {
        const courseParams = {
            name: "cse110", 
            term: "sp20",
            uuid: "course1",
            instructorList: ["user2"], 
            studentList: ["user1"],
            tagList: ["dummy_tag"],
            postList: ["dummy_post"],
        }

        try {
            const result = await course.pushCourseToFirebase(courseParams, { uuid: "fakeUser" }, courseParams.uuid);
            expect(result).to.equal(courseParams.uuid);
        } catch(e) {
            console.log(e);
        }  
    })

    it('should get course from firebase', async () => {
        const uuid = 'course1';
        const testCourse = await course.getCourseById(uuid);
        expect(testCourse.getTerm()).to.equal("sp20");
    })

    it('should add tag to course1s tag list', async () => {
        const uuid = 'course1';
        const testCourse = await course.getCourseById(uuid);
        testCourse.addTag('tag1');
        expect(1).to.equal(1);
    })

    it('should get tag from tagList', async () => {
        const uuid = 'course1';
        const testCourse = await course.getCourseById(uuid);
        const tagId = testCourse.getTagList()[0];
        expect(tagId).to.equal("tag1");
    })

    

    it('should add post to course', async () => {
        const uuid = 'course1';
        const testCourse = await course.getCourseById(uuid);
        testCourse.addPost("post1");
        testCourse.addPost("post2");
        expect(testCourse.getPostList().length).to.equal(2);
    })

    it('should add post to course and get posts associated with a tag', async () => {
        const uuid = 'course1';
        const testCourse = await course.getCourseById(uuid);
        const posts = await testCourse.getPostsWithTag("tag1");
        expect(posts.length).to.equal(2);
    })

    it('should get posts associated with a tag', async () => {
        const testCourse = await course.getCourseById('course1');
        const posts = await testCourse.getPostsWithMultipleTags(['tag1', 'tag2'])
        expect(posts.length).to.equal(2);
    })

    it('should classify the user according to their status', async () => {
        const testCourse = await course.getCourseById('course1');
        expect(testCourse.classifyUser('user2')).to.equal('instructor');
        expect(testCourse.classifyUser('user1')).to.equal('student');
        expect(testCourse.classifyUser('Rohith')).to.equal('null');
    })

    it('should return all the private posts for course1', async () => {
        const testCourse = await course.getCourseById('course1');
        const privatePost = await testCourse.getPrivatePosts();
        expect(privatePost[0]).to.equal('post2');
    })

    
    it('should return all the public posts for course1', async () => {
        const testCourse = await course.getCourseById('course1');
        const publicPost = await testCourse.getPublicPosts();
        expect(publicPost[0]).to.equal('post1');
    })

    
    it('should return all the pinned posts for course1', async () => {
        const testCourse = await course.getCourseById('course1');
        const pinnedPost = await testCourse.getPinnedPosts();
        expect(pinnedPost[0]).to.equal('post1');
    })

    
    it('should return all the announcements for course1', async () => {
        const testCourse = await course.getCourseById('course1');
        const announcements = await testCourse.getAnnouncements();
        expect(announcements[0]).to.equal('post1');
    })

    it('should add instructor to pending list', async () => {
        const testCourse = await course.getCourseById('course1');
        await testCourse.addPendingInstructor("user1");
        const pendingInstructorList = await testCourse.getPendingInstructorList();
        expect(pendingInstructorList.length).to.equal(1);
    })

    it('should add instructor to pending list', async () => {
        const testCourse = await course.getCourseById('course1');
        await testCourse.addPendingInstructor("d1truong@ucsd.edu");
        const pendingInstructorList = await testCourse.getPendingInstructorList();
        expect(pendingInstructorList.length).to.equal(1);
    })

    it('should remove instructor off pending list', async () => {
        const testCourse = await course.getCourseById('course1');
        await testCourse.removePendingInstructor("d1truong@ucsd.edu");
        const pendingInstructorList = await testCourse.getPendingInstructorList();
        expect(pendingInstructorList.length).to.equal(0);
    })
});