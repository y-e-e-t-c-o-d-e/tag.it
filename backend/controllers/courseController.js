//Uncomment this wheen the models are good
const course = require("../models/Course");
const nodemailer = require('nodemailer');
const post = require("../models/Post");
const { db } = require("../shared/firebase")

// Adds a course to the database based on req body
exports.addCourse = async (req, res) => {

   // Check that required data is given
   const bodyParams = req.body;
   if (!("name" in bodyParams && "term" in bodyParams)) {
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
    ref.once("value", function (snapshot) {
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

exports.verifyCourse = async (req, res) => {

    console.log("running verification");

    const bodyParams = req.params;
    const courseid = bodyParams["courseId"];
    const inviteId = bodyParams["inviteId"];

    if (!courseid) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseId"
        })
    }

    if (!inviteId) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: inviteId"
        })
    }

    try {
        const courseObj = await course.getCourseById(courseid);

        // Verify that invite code is equal
        if (courseObj.getStudentInviteId() === inviteId) {
            res.status(200).json({
                status: 200,
                type: "student"
            });
        } else if (courseObj.getTeacher() === inviteId) {
            res.status(200).json({
                status: 200,
                type: "instructor"
            })
        } else {
            res.status(500).json({
                status: 500,
                type: null,
                error: "Invite id is not valid"
            });
        }
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: "Course obj not being able to got from Firebase"
        });
    }
}

// Gets info on the given course based on the user type
exports.getCourseInfo = async (req, res) => {
    const courseUUID = req.params.courseId;
    const userObj = req.user;
    debugger
    console.log(`recieved request`)
    
    if (!courseUUID || !userObj) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseUUID or userUUID"
        });
    }


    console.log(`recieved request for ${courseUUID}`)
    try {
        const courseObj = await course.getCourseById(courseUUID);
        let type = "";
        // Check if user is an instructor or student, student can't see studentList
        if (courseObj.getInstructorList().indexOf(userObj.getUUID()) != -1) {
            type = "student";
        } else if (courseObj.getStudentList().indexOf(userObj.getUUID()) != -1) {
            type = "instructor";
        } else {
            res.status(200).json({
                error: "Course info is not available"
            });
            return;
        }

        // Gets all the Post Objects
        let postContentList = await courseObj.getPostList().reduce(async (acc, postId, index) => {
            // Ensures that only a certain amount of posts are rendered
            try {
                const postObj = await post.getPostById(postId);
                (await acc).push(postObj.props);
                return acc;
            } catch (e) {
                return acc;
            }
        }, Promise.resolve([]));

        // Gets all the Tag Objects
        const tagContentList = await courseObj.getPostList().reduce(async (acc, postId) => {
            try {
                const tagObj = await post.getPostById(postId);
                (await acc).push(tagObj.props);
                return acc;
            } catch (e) {
                return acc;
            }
        }, Promise.resolve([]));

        // Sort Posts based on time
        postContentList.sort((post1, post2) => {
            // Date Format: MMDDYYYY HH:MM
            const a = post1.time;
            const b = post2.time;

            // Date Object Format - Date(year, month, day, hour, minute, seconds)
            const date1 = new Date(a);
            const date2 = new Date(b);
            
            if (date1 < date2) {
                return 1;
            } else {
                return -1;
            }
        });

        res.status(200).json({
            ...courseObj.props,
            postList: postContentList,
            tagList: tagContentList,
            type: type
        });
    } catch (e) {
        console.log("no course fuond")
        console.log(e)
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
        res.status(200).send("removed course with the following courseUUID:" + courseUUID);
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
};

// Sends an email to the passed in user (defaults to student)
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
           error: "Missing the following parameters: email"
       });
       return;
    };

    try {
        const courseObj = await course.getCourseById(courseUUID);
        let inviteURL;
        if ("type" in bodyParams && bodyParams["type"] == "instructor") {
            inviteURL = "https://tagdotit.netlify.app/course/"+courseUUID+"/invite/"+courseObj.getInstructorInviteId();
        } else {
            inviteURL = "https://tagdotit.netlify.app/course/"+courseUUID+"/invite/"+courseObj.getStudentInviteId();
        }

        let transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "927580363f9fc5",
                pass: "81ac04611559b3"
            }
        });

        let mailOptions = {
            from: 'tag.it',
            to: bodyParams["email"],
            subject: "Invite link for new course " + courseObj.getName() + " on tag.it!",
            text: "You've been invited to use the sickest platform to grace this planet! Check it out here: " + inviteURL
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send("Invite sent!");
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
};