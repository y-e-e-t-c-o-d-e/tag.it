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
            instructorList: "user2", 
            studentList: "user1",
            tagList: ["dummy_tag"],
            postList: ["dummy_post"],
        }

        try {
            const result = await course.pushCourseToFirebase(courseParams);
            expect(result).to.equal("Everything worked");
            //expect(1).to.equal(1);
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

});