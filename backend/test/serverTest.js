const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');

const User = require("../models/User");
const Course = require("../models/Course");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Tag = require("../models/Tag");

chai.use(chaiHttp)

// Test suite for index routes (make separate test file for each set of routes)
describe('index routes', () => {

  let server;

  let userUUID = "uuid";
  let userObj;
  let userUUID2 = "uuid2";
  let userObj2;
  let userUUID3 = "uuid3";
  let userObj3;
  let userUUID4 = "uuid4";
  let userObj4;

  let courseKey;
  let courseObj;
  let studentInviteKey;
  let instrInviteKey;
  let courseKey2;
  let courseObj2;

  let postKey;
  let postObj;
  let postKey2;
  let postObj2;

  let commentKey;
  let commentObj;

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

    // User 3 set up 
    const user3Params = {
      name: "pending instr",
      email: "i1@ucsd.edu",
      uuid: userUUID3
    };
    await User.pushUserToFirebase(user3Params);
    userObj3 = await User.getUserById(userUUID3);

    // User 4 set up 
    const user4Params = {
      name: "post author",
      email: "u4@ucsd.edu",
      uuid: userUUID4
    };
    await User.pushUserToFirebase(user4Params);
    userObj4 = await User.getUserById(userUUID4);

    // Course 1 set up 
    const course1 = {
        name: "Test Course 1",
        term: "Fall 2020",
        description: "TESTING 123"
    };
    courseKey = await Course.pushCourseToFirebase(course1, userObj);
    courseObj = await Course.getCourseById(courseKey);
    await courseObj.addStudent(userUUID2);
    await courseObj.addPendingInstructor(userObj3.getEmail());
    studentInviteKey = courseObj.getStudentInviteId();
    instrInviteKey = courseObj.getInstructorInviteId();

    // Course 2 set up 
    const course2 = {
      name: "Course with posts",
      term: "Spring 2020",
      description: "TESTING MORE"
    };
    courseKey2 = await Course.pushCourseToFirebase(course2, userObj4);
    courseObj2 = await Course.getCourseById(courseKey2);    

    // Post 1 set up
    const post1 = {
      title: "Test Post 1",
      content: "Help me pls",
      author: userUUID4,
      course: courseKey2
    }
    postKey = await Post.pushPostToFirebase(post1);
    postObj = await Post.getPostById(postKey);

    // Post 2 set up
    const post2 = {
      title: "Post with comment",
      content: "Help me pls",
      author: userUUID4,
      course: courseKey2
    }
    postKey2 = await Post.pushPostToFirebase(post2);
    postObj2 = await Post.getPostById(postKey2);

    // Comment set up
    const comment1 = {
      content: "I agree",
      postId: postKey2,
      author: userUUID4
    }
    commentKey = await Comment.pushCommentToFirebase(comment1);
    commentObj = await Comment.getCommentById(commentKey);
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

    it('get users of course', (done) => {
      chai.request(server)
        .get(`/api/course/${courseKey}/users`)
        .set("Authorization", `Bearer ${userUUID}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).deep.equal({
            students: [userObj2.props],
            instructors: [userObj.props],
            pendingInstructorList: [userObj3.getEmail()]
          });
          done();
        })
    });

    it('verify invite link: student', (done) => {
      chai.request(server)
        .get(`/api/course/${courseKey}/invite/${studentInviteKey}`)
        .set("Authorization", `Bearer ${userUUID}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).deep.equal({
            status: 200,
            type: "student"
          });
          done();
        })
    });

    it('verify invite link: instructor', (done) => {
      chai.request(server)
        .get(`/api/course/${courseKey}/invite/${instrInviteKey}`)
        .set("Authorization", `Bearer ${userUUID3}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).deep.equal({
            status: 200,
            type: "instructor",
            error: ""
          });
          done();
        })
    });

    it('fail to verify invite link: instructor', (done) => {
      chai.request(server)
        .get(`/api/course/${courseKey}/invite/${instrInviteKey}`)
        .set("Authorization", `Bearer ${userUUID2}`)
        .end((err, res) => {
          expect(res).to.have.status(410);
          expect(res.body).deep.equal({
            status: 410,
            type: null,
            error: "User has not been invited to join staff by the instructors"
          });
          done();
        })
    });
  });

  describe('post routes', () => {
    it('get post', (done) => {
      chai.request(server)
        .get('/api/post')
        .query({postUUID: postKey})
        .set("Authorization", `Bearer ${userUUID4}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).deep.equal({
            ...postObj.props, 
            filledInTags: [], 
            authorName: userObj4.getName()
          });
          done();
        });
    });
  });

  describe('comment routes', () => {
    it('get comment', (done) => {
      chai.request(server)
        .get('/api/comment')
        .query({postUUID: postKey2})
        .set("Authorization", `Bearer ${userUUID4}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).deep.equal([commentObj.props]);
          done();
        });
    });
  });
});