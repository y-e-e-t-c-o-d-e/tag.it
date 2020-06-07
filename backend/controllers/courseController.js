//Uncomment this wheen the models are good
const Course = require("../models/Course");
const nodemailer = require('nodemailer');
const Post = require("../models/Post");
const Tag = require("../models/Tag");
const User = require("../models/User");
const { db } = require("../shared/firebase")

// Adds a course to the database based on req body
exports.addCourse = async (req, res) => {

   // Check that required data is given
   const bodyParams = req.body;
   if (!("name" in bodyParams && "term" in bodyParams && "description")) {
       res.status(422).json({
           status: 422,
           error: "Missing one of the following parameters: name or term or description"
       });
       return;
   };

   try {
       const courseId = await Course.pushCourseToFirebase(bodyParams, req.user);
       res.status(200).send(courseId);
   } catch (e) {
       res.status(410).json({
           status: 410,
           error: e
       })
   }
};

// Gets all the courses currently in the database
exports.getAllCourses = async (req, res) => {
    const ref = db.ref('Courses');
    ref.once("value", function (snapshot) {
        res.status(200).json(snapshot.val() || []);
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
        const courseObj = await Course.getCourseById(courseUUID);

        if ("name" in bodyParams) {
            courseObj.setName(bodyParams["name"]);
        }
        if ("description" in bodyParams) {
            courseObj.setDescription(bodyParams["description"]);
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

    const bodyParams = req.params;
    const userObj = req.user;
    const courseid = bodyParams["courseid"];
    const inviteId = bodyParams["inviteid"];

    if (!courseid) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseid"
        })
        return;
    }

    if (!inviteId) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: inviteid"
        })
        return;
    }

    try {
        const courseObj = await Course.getCourseById(courseid);

        // Verify that invite code is equal
        if (courseObj.getStudentInviteId() === inviteId) {
            res.status(200).json({
                status: 200,
                type: "student"
            });
            return;
        } else if (courseObj.getInstructorInviteId() === inviteId) {
            let errorMsg = "";
            let status = 200; 
            let type = "instructor";

            // Return if user is not in instructor list
            const pendingList = await (courseObj.getPendingInstructorList());
            
            if (pendingList.indexOf(userObj.getEmail()) < 0) {
                errorMsg = "User has not been invited to join staff by the instructors";
                status = 410;
                type = null;
            };

            res.status(status).json({
                status: status,
                type: type,
                error: errorMsg
            });
            return;
        } else {
            res.status(500).json({
                status: 500,
                type: null,
                error: "Invite id is not valid"
            });
            return;
        }
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: "Course obj not retrieved from Firebase"
        });
    }
}

// Gets info on the given course based on the user type
exports.getCourseInfo = async (req, res) => {
    const courseUUID = req.params.courseId;
    const userObj = req.user;
    
    if (!courseUUID || !userObj) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseUUID or userUUID"
        });
    }

    try {
        const courseObj = await Course.getCourseById(courseUUID);
        let type = courseObj.classifyUser(req.user.getUUID());

        // Gets all the Post Objects
        let postContentList = await courseObj.getPostList().reduce(async (acc, postId, index) => {
            // Ensures that only a certain amount of posts are rendered
            try {
                const postObj = await Post.getPostById(postId);

                // Does not add private posts if user is a student (except if the private post is yours)
                if (type === "instructor" || !postObj.isPrivate || postObj.getAuthor() === req.user.getUUID()) {
                    (await acc).push(postObj.props);
                }
                
                return acc;
            } catch (e) {
                return acc;
            }
        }, Promise.resolve([]));

        // Gets all the Tag Objects
        const tagContentList = await courseObj.getTagList().reduce(async (acc, tagId) => {
            try {
                const tagObj = await Tag.getTagById(tagId);
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
        Course.deleteCourseById(courseUUID);
        res.status(200).send("removed course with the following courseUUID:" + courseUUID);
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
};

// Gets all the course users
exports.getCourseUsers = async (req, res) => {
    const courseUUID = req.params.courseId;
    if (!courseUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseUUID"
        });
        return;
    };

    try {
        const courseObj = await Course.getCourseById(courseUUID);
        
        const studentList = await courseObj.getStudentList();
        const instructorList = await courseObj.getInstructorList();

        const filledInInstructors = await Promise.all(instructorList.map(
            async (instructorId) => (await User.getUserById(instructorId)).props));
        const filledInStudents = await Promise.all(studentList.map(
            async (studentId) => (await User.getUserById(studentId)).props));

        res.status(200).json({
            students: filledInStudents,
            instructors: filledInInstructors
        });
    } catch (e) {
        res.status(410).json({
            error: e.message
        })
    }
}

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
        const courseObj = await Course.getCourseById(courseUUID);

        // Adds user to pending instructor list
        await courseObj.addPendingInstructor(bodyParams["email"]);

        let inviteURL;

        if (bodyParams["type"] === "instructor") {
            inviteURL = "https://tagdotit.netlify.app/courses/"+courseUUID+"/invite/"+courseObj.getInstructorInviteId();
        } else {
            inviteURL = "https://tagdotit.netlify.app/courses/"+courseUUID+"/invite/"+courseObj.getStudentInviteId();
        }

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "tag.it.yeetcode@gmail.com",
                pass: "yeetcode"
            }
        });

        let mailOptions = {
            from: "tag.it.yeetcode@gmail.com",
            to: bodyParams["email"],
            subject: "Invite link for new course " + courseObj.getName() + " on tag.it!",
            text: "You've been invited to use the sickest platform to grace this planet! Check it out here:\n" + inviteURL
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send("Invite sent!");
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    }
}

exports.removeUser = async (req, res) => {
    const courseUUID = req.params.courseId;
    const userUUID = req.params.userId;
    
    if (!courseUUID || !userUUID) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseUUID or userUUID"
        });
        return;
    }

    try {
        const courseObj = await Course.getCourseById(courseUUID);
        const userType = courseObj.classifyUser(userUUID);

        if (userType === "student") {
            await courseObj.removeStudent(userUUID);
        } else if (userType === "instructor") {
            await courseObj.removeInstructor(userUUID);
        } else {
            // Remove user from pending instructor
            const userObj = await User.getUserById(userUUID);
            await courseObj.removePendingInstructor(userObj.getEmail());

            res.status(410).send({
                error: "User is not in the course"
            })
            return;
        }

        res.status(200).send(`User removed as a ${userType}`);

    } catch (e) {
        res.status(410).json({
            error: e.message
        })
    }
}

exports.deletePendingUser = async (req, res) => {
    const courseUUID = req.params.courseId;
    const email = req.params.email;
    
    if (!courseUUID || !email) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseUUID or email"
        });
        return;
    }

    try {
        const courseObj = await Course.getCourseById(courseUUID);
        courseObj.removePendingInstructor(email);
        res.status(200).send(`User removed as a pending instructor`);

    } catch (e) {
        res.status(410).json({
            error: e.message
        })
    }
}
