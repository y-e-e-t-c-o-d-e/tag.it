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

   let testInstructor1, courseId1, courseObj1, testInstructor2, testStudent1
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

    try {
        await user.pushUserToFirebase(instructor1Params);
        await user.pushUserToFirebase(instructor2Params);
        await user.pushUserToFirebase(student1Params);
        testInstructor1 = await user.getUserById(instructor1Key);
        testInstructor2 = await user.getUserById(instructor2Key);
        testStudent1 = await user.getUserById(student1Key);


        // relies on a course
        const courseData1 = {
            name: "Test Course 1",
            term: "Fall 2020",
            description: "wow a description"
        }

        courseId1 = await course.pushCourseToFirebase(courseData1, testInstructor1);
        courseObj1 = await course.getCourseById(courseId1);
    } catch(e) {
        console.log(e);
    }
   });
 
   // Teardown function after test is run
    after(async () => {
       console.log("Teardown for Shared Test Suite");
       await user.deleteUserById(instructor1Key);
       await user.deleteUserById(instructor2Key);
       await user.deleteUserById(student1Key);
       await course.deleteCourseById(courseId1);
    });
 
 
    it('should test user and course are in firebase', async () => {
       expect(testInstructor1.getName()).to.equal("instructor1");
       expect(courseObj1.getName()).to.equal("Test Course 1");
    })

    it('should test user is part of courses instructorList and vice versa', async () => {
        const courseList = await courseObj1.getInstructorList();
        const userList = await testInstructor1.getInstructorCourseList();
        expect(userList[0]).to.equal(courseId1);
        expect(courseList[0]).to.equal(instructor1Key);
    })

    it('should test the adding of a second instructor to courseObj1', async () => {
        await courseObj1.addPendingInstructor(testInstructor2.getEmail());
        await testInstructor2.addInstructorCourse(courseId1);
        const courseList = await courseObj1.getInstructorList();
        const userList = await testInstructor1.getInstructorCourseList();
        
        expect(userList[0]).to.equal(courseId1);
        expect(courseList[1]).to.equal(instructor2Key);
    })

    it('should test the removal of instructor2', async () => {
        await courseObj1.removeInstructor(instructor2Key);
        const courseList = await courseObj1.getInstructorList();
        expect(courseList.length).to.equal(1);
        const userList = await testInstructor2.getInstructorCourseList();
        expect(userList.length).to.equal(0);
    })

    it('should test the addition and removal of student1', async () => {
        await testStudent1.addStudentCourse(courseId1);
        let userList = await testStudent1.getStudentCourseList();
        let courseList = await courseObj1.getStudentList();
        expect(courseList.length).to.equal(1);
        expect(userList.length).to.equal(1);

        await courseObj1.removeStudent(student1Key);
        userList = await testStudent1.getStudentCourseList();
        courseList = await courseObj1.getStudentList();
        expect(courseList.length).to.equal(0);
        expect(userList.length).to.equal(0);

    })





   
    
});
