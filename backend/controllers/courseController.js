//Uncomment this wheen the models are good
const course = require("../models/Course");
const user = require("../models/User");
const nodemailer = require('nodemailer');
const { db } = require("../shared/firebase")

// Adds a course to the database based on req body
exports.addCourse = async (req, res) => {
   // Check that required data is given
   const bodyParams = req.body;
   if (!("name" in bodyParams || "term" in bodyParams)) {
       res.status(422).json({
           status: 422,
           error: "Missing one of the following parameters: name or term"
       });
       return;
   };

   try {
       await course.pushCourseToFirebase(bodyParams, req.user);
       res.status(200).send(`Added course ${bodyParams.name}`)
   } catch (e) {
       res.status(410).json({
           status: 410,
           error: "Server could not push to firebase"
       })
   }
};

// Gets all the courses currently in the database
exports.getAllCourses = async (req, res) => {
    const ref = db.ref('Courses');
    ref.once("value", function(snapshot) {
        res.status(200).json(snapshot.val());
    });
};

// We can add more deletions in here when we have more remove methods in Course model
exports.updateCourse = async (req, res) => {
    // Object of fields and values to update in the user object
    const bodyParams = req.body;
    const courseUUID = bodyParams["uuid"];

    if (!courseUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseUUID"
        });
        return;
    };

    try {
        const courseObj = await course.getCourseById(courseUUID);

        if ("name" in bodyParams) {
            courseObj.setName(bodyParams["name"]);
        }
        if ("term" in bodyParams) {
            courseObj.setTerm(bodyParams["term"]);
        }
        if ("tag" in bodyParams) {
            courseObj.addTag(bodyParams["tag"]);
        }
        if ("post" in bodyParams) {
            courseObj.addPost(bodyParams["post"]);
        }
        if ("student" in bodyParams) {
            courseObj.addStudent(bodyParams["student"]);
        }
        if ("instructor" in bodyParams) {
            courseObj.addInstructor(bodyParams["instructor"]);
        }
        res.status(200).send("Updated course");
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
};

// Gets info on the given course based on the user type
exports.getCourseInfo = async (req, res) => {
    const courseUUID = req.params.courseId;
    const userObj = req.user;

    if (!courseUUID || !userObj) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseUUID or userUUID"
        });
        return;
    };

    try {
        const courseObj = await course.getCourseById(courseUUID);
        
        // Check if user is an instructor or student, student can't see studentList
        if (courseObj.getInstructorList().indexOf(userObj.getUUID()) != -1) {
            res.status(200).json(courseObj);
        } else if (courseObj.getStudentList().indexOf(userObj.getUUID()) != -1) {
            res.status(200).json({
                name: courseObj.getName(),
                term: courseObj.getTerm(),
                instructorList: courseObj.getInstructorList(),
                tagList: courseObj.getTagList(),
                postList: courseObj.getPostList()
            });
        } else {
            res.status(200).json({
                error: "Course info is not available"
            });
        }
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e.message
        });
    };
};

// Deletes course
exports.deleteCourse = async (req, res) => {
    const courseUUID = req.params.courseId;
    if (!courseUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseUUID"
        });
        return;
    };

    try {
        course.deleteCourseById(courseUUID);
        res.status(200).send("removed course with the following courseUUID:" + courseUUID)
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
};

// Sends an email to the passed in user, if possible
exports.sendEmail = async (req, res) => {
    const courseUUID = req.params.courseId;
    if (!courseUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseUUID"
        });
        return;
    };

    const bodyParams = req.body;
    if (!("email" in bodyParams)) {
       res.status(422).json({
           status: 422,
           error: "Missing the following parameter: email"
       });
       return;
   };

    try {
        const courseObj = course.getCourseById(courseUUID);
        const studentList = courseObj.getStudentList();
        let student;
        for (let i = 0; i < studentList.length; i++) {
            student = user.getUserById(studentList[i]);
            if (student.getEmail() == bodyParams["email"]) {
                let transporter = nodemailer.createTransport({
                    host: "smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                      user: "60438c70e2cd80",
                      pass: "4320d95a84005b"
                    }
                  });
    
                let mailOptions = {
                    from: 'tagitcse110',
                    to: bodyParams["email"],
                    subject: this.props.title + ' has been updated!',
                    // TODO: Need field for post url to add to updated email.
                    text: 'Check it out here'
                };
    
                await transporter.sendMail(mailOptions);
            }
        }
        res.status(200).send("User not in course")
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
}