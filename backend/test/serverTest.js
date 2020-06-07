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

  let courseKey;
  let courseObj;

  // Set up function before every test
  before(async () => {
    server = require('../app');

    // Student set up 
    const student1Params = {
      name: "student1",
      email: "u3@ucsd.edu",
      uuid: userUUID
    };
    await User.pushUserToFirebase(student1Params);
    userObj = await User.getUserById(userUUID);

    // Course set up 
    const course1 = {
        name: "Test Course 1",
        term: "Fall 2020",
        description: "TESTING 123"
    };
    courseKey = await Course.pushCourseToFirebase(course1, userObj);
    courseObj = await Course.getCourseById(courseKey);
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