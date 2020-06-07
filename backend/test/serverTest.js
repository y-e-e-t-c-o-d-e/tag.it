const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');

const User = require("../models/User");
const Course = require("../models/Course");

chai.use(chaiHttp)

// Test suite for index routes (make separate test file for each set of routes)
describe('index routes', () => {

  let server;

  let userUUID = "uuid";
  let userObj;
  let userUUID2 = "uuid2"
  let userObj2;

  let courseKey;
  let courseObj;

  // Set up function before every test
  before(async () => {
    server = require('../app');

    // User 1 set up 
    const user1Params = {
      name: "student1",
      email: "u3@ucsd.edu",
      uuid: userUUID
    };
    await User.pushUserToFirebase(user1Params);
    userObj = await User.getUserById(userUUID);

    // User 2 set up 
    const user2Params = {
      name: "student2",
      email: "u2@ucsd.edu",
      uuid: userUUID2
    };
    await User.pushUserToFirebase(user2Params);
    userObj2 = await User.getUserById(userUUID2);

    // Course set up 
    const course1 = {
        name: "Test Course 1",
        term: "Fall 2020",
        description: "TESTING 123"
    };
    courseKey = await Course.pushCourseToFirebase(course1, userObj);
    courseObj = await Course.getCourseById(courseKey);
    await courseObj.addStudent(userUUID2);
  });

  // Tear down function that runs after every test
  after(async () => {
    server.close();
    await User.deleteUserById(userUUID);
    await Course.deleteCourseById(courseKey);
  })
    
  it('should protect authenticated routes', (done) => {
      chai.request(server)
      .get('/api/protected')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      })
  })

  it('should accept authenticated users', (done) => {
    chai.request(server)
      .get('/api/protected')
      .set("Authorization", `Bearer ${userUUID}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      })
  });

  describe('user routes', () => {
    it('get user', (done) => {
      chai.request(server)
        .get('/api/user')
        .set("Authorization", `Bearer ${userUUID}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).deep.equal({
            ...userObj.props, 
            filledInInstructorCourseList: [courseObj.props], 
            filledInStudentCourseList: []
          });
          done();
        });
    });

    it('get user type: instructor', (done) => {
      chai.request(server)
        .get(`/api/user/${courseKey}`)
        .set("Authorization", `Bearer ${userUUID}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).deep.equal({
            type: "Instructor"
          });
          done();
        });
    });
    
    it('get user type: student', (done) => {
      chai.request(server)
        .get(`/api/user/${courseKey}`)
        .set("Authorization", `Bearer ${userUUID2}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).deep.equal({
            type: "Student"
          });
          done();
        });
    });
  });

  describe('course routes', () => {
    it('get all courses', (done) => {
      chai.request(server)
        .get('/api/course')
        .set("Authorization", `Bearer ${userUUID}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        })
    });

    it('get one course', (done) => {
      chai.request(server)
        .get(`/api/course/${courseKey}`)
        .set("Authorization", `Bearer ${userUUID}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).deep.equal({
            ...courseObj.props,
            postList: [],
            tagList: [],
            type: "instructor"
          });
          done();
        })
    });

  });

});