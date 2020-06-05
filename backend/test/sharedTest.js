const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const post = require("../models/Post");
const user = require("../models/User");
const tag = require("../models/Tag");
const comment = require("../models/Comment");
const course = require("../models/Course");
const { db } = require("../shared/firebase")
 
// Shared test suite
describe('shared', () => {
   let instructor1Key = db.ref("Users").push().key; 
   let instructor2Key = db.ref("Users").push().key; 
   let student1Key = db.ref("Users").push().key;

   let testInstructor1, testInstructor2, testStudent1
   let course1Key, courseObj1
   let post1Key, testPost1, post2Key, testPost2
   let testTag1, tag1Key
   // Setup function before test is run
    before(async () => {
    console.log("Setup for Shared Test Suite")
    const instructor1Params = {
        name: "instructor1",
        email: "u1@ucsd.edu",
        uuid: instructor1Key
    }
    const instructor2Params = {
        name: "instructor2",
        email: "u2@ucsd.edu",
        uuid: instructor2Key
    }
    const student1Params = {
        name: "student1",
        email: "u3@ucsd.edu",
        uuid: student1Key
    }
    const courseData1 = {
        name: "Test Course 1",
        term: "Fall 2020",
        description: "TESTING 123"
    }
    

    try {
        await user.pushUserToFirebase(instructor1Params);
        await user.pushUserToFirebase(instructor2Params);
        await user.pushUserToFirebase(student1Params);
        testInstructor1 = await user.getUserById(instructor1Key);
        testInstructor2 = await user.getUserById(instructor2Key);
        testStudent1 = await user.getUserById(student1Key);

        // relies on a course
        course1Key = await course.pushCourseToFirebase(courseData1, testInstructor1);
        courseObj1 = await course.getCourseById(course1Key);

        const post1Params = {
            title: "TEST POST 1", 
            content: "TEST",
            author: student1Key, 
            isAnnouncement: true,
            isPinned: true,
            isAnonymous: true,
            isPrivate: true,
            isInstructor: false,
            course: course1Key
        }

        const post2Params = {
            title: "TEST POST 2", 
            content: "TEST 2",
            author: instructor1Key, 
            isAnnouncement: true,
            isPinned: true,
            isAnonymous: true,
            isPrivate: true,
            isInstructor: true,
            course: course1Key
        }

        // post created by student1
        post1Key = await post.pushPostToFirebase(post1Params);
        testPost1 = await post.getPostById(post1Key);
        post2Key = await post.pushPostToFirebase(post2Params);
        testPost2 = await post.getPostById(post2Key);

        const tag1Params = {
            name: "TEST TAG",
            course: course1Key,
            postList: [post2Key],
        }

        tag1Key = await tag.pushTagToFirebase(tag1Params);
        testTag1 = await tag.getTagById(tag1Key);



    } catch(e) {
        console.log(e);
    }
   });
 
   // Teardown function after test is run
    after(async () => {
       console.log("Teardown for Shared Test Suite");
       
       await post.deletePostById(post1Key);
       await tag.deleteTagById(tag1Key);
       await post.deletePostById(post2Key);
       await user.deleteUserById(student1Key);
       await user.deleteUserById(instructor1Key);
       await user.deleteUserById(instructor2Key);
       await course.deleteCourseById(course1Key);
       
    });
 
 
    it('should test user and course are in firebase', async () => {
       expect(testInstructor1.getName()).to.equal("instructor1");
       expect(courseObj1.getName()).to.equal("Test Course 1");
    })

    it('should test user is part of courses instructorList and vice versa', async () => {
        const courseList = await courseObj1.getInstructorList();
        const userList = await testInstructor1.getInstructorCourseList();
        expect(userList[0]).to.equal(course1Key);
        expect(courseList[0]).to.equal(instructor1Key);
    })

    it('should test the adding of a second instructor to courseObj1', async () => {
        await courseObj1.addPendingInstructor(testInstructor2.getEmail());
        await testInstructor2.addInstructorCourse(course1Key);
        const courseList = await courseObj1.getInstructorList();
        const userList = await testInstructor1.getInstructorCourseList();
        
        expect(userList[0]).to.equal(course1Key);
        expect(courseList[1]).to.equal(instructor2Key);
    })


    it('should test the addition of student1', async () => {
        testStudent1 = await user.getUserById(student1Key);
        await testStudent1.addStudentCourse(course1Key);
        let userList = await testStudent1.getStudentCourseList();
        let courseList = await courseObj1.getStudentList();

        expect(courseList.length).to.equal(1);
        expect(userList.length).to.equal(1);
    })

    it ('should check to see if post is in student and course postList', async () => {
        courseObj1 = await course.getCourseById(course1Key);
        testStudent1 = await user.getUserById(student1Key);
        let courseList = courseObj1.getPostList();
        let studentList = testStudent1.getPostList();
        expect(courseList[0]).to.equal(studentList[0]);
    })

    it ('should make sure that when user likes post, both are updated', async () => {
        testStudent1 = await user.getUserById(student1Key);
        testPost1 = await post.getPostById(post1Key);
        await testStudent1.addLikedPost(post1Key);
        testStudent1 = await user.getUserById(student1Key);
        testPost1 = await post.getPostById(post1Key);
        let likedPostList = testStudent1.getLikedPostList();
        expect(likedPostList[0]).to.equal(post1Key);
        expect(testPost1.getScore()).to.equal(1);

    })

    it ('should make sure that when user unlikes post, both are updated', async() => {
        testStudent1 = await user.getUserById(student1Key);
        testPost1 = await post.getPostById(post1Key);
        await testStudent1.removeLikedPost(post1Key);
        testStudent1 = await user.getUserById(student1Key);
        testPost1 = await post.getPostById(post1Key);
        let likedPostList = testStudent1.getLikedPostList();
        expect(likedPostList.length).to.equal(0);
        expect(testPost1.getScore()).to.equal(0);
    })

    it ('should make sure when user follows post, both are updated', async() => {
        testInstructor1 = await user.getUserById(instructor1Key);
        testPost1 = await post.getPostById(post1Key);

        await testInstructor1.addFollowedPost(post1Key);
        testInstructor1 = await user.getUserById(instructor1Key);
        testPost1 = await post.getPostById(post1Key);

        let likedPostList = testInstructor1.getFollowingList();
        let followingUsersList = testPost1.getUsersFollowing();
        expect(likedPostList[0]).to.equal(post1Key);
        expect(followingUsersList[1]).to.equal(instructor1Key);
    })

    it ('should make sure when user unfollows post, both are updated', async() => {
        testInstructor1 = await user.getUserById(instructor1Key);
        testPost1 = await post.getPostById(post1Key);

        await testInstructor1.removeFollowedPost(post1Key);
        testInstructor1 = await user.getUserById(instructor1Key);
        testPost1 = await post.getPostById(post1Key);

        let likedPostList = testInstructor1.getFollowingList();
        let followingUsersList = testPost1.getUsersFollowing();
        expect(likedPostList.length).to.equal(0);
        expect(followingUsersList.length).to.equal(1);
    })

    it ('should test the adding tag to post functionality', async () => {
        testTag1 = await tag.getTagById(tag1Key);
        testPost1 = await post.getPostById(post1Key);

        await testPost1.addTag(tag1Key);
        testTag1 = await tag.getTagById(tag1Key);
        testPost1 = await post.getPostById(post1Key);

        let tagList = testPost1.getTagList();
        let postList = testTag1.getPostList();

        expect(tagList[0]).to.equal(tag1Key);
        expect(postList[1]).to.equal(post1Key);
    })

    /*it ('should test the removing tag from post functionality', async () => {
        testTag1 = await tag.getTagById(tag1Key);
        testPost1 = await post.getPostById(post1Key);

        await testPost1.removeTag(tag1Key);
        testTag1 = await tag.getTagById(tag1Key);
        testPost1 = await post.getPostById(post1Key);

        let tagList = testPost1.getTagList();
        let postList = testTag1.getPostList();

        expect(tagList.length).to.equal(0);
        expect(postList.length).to.equal(1);
    })*/



    /*it('should test the removal of student1', async () => {
        await courseObj1.removeStudent(student1Key);
        userList = await testStudent1.getStudentCourseList();
        courseList = await courseObj1.getStudentList();
        expect(courseList.length).to.equal(0);
        expect(userList.length).to.equal(0);
    })

    it('should test the removal of instructor2', async () => {
        await courseObj1.removeInstructor(instructor2Key);
        const courseList = await courseObj1.getInstructorList();
        expect(courseList.length).to.equal(1);
        const userList = await testInstructor2.getInstructorCourseList();
        expect(userList.length).to.equal(0);
    })*/
    



   
    
});
