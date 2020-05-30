//Uncomment this wheen the models are good
const course = require("../models/Course");
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
       });
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

exports.verifyCourse = async (req, res) => {
    
    console.log("running verify course");

    const bodyParams = req.params;
    const courseid = bodyParams["courseid"];
    const inviteId = bodyParams["inviteid"];

    if (!courseid) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseUUID"
        });
        return;
    };

    if (!courseid) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: inviteid"
        });
        return;
    };

    try {
        const courseObj = await course.getCourseById(courseid);

        console.log(inviteId);
        console.log(courseObj.getInviteId());
        // Verify that invite code is equal
        if (courseObj.getInviteId() == inviteId) {
            res.status(200).json({
                status: 200,
                verified: true
            });
        } else {
            res.status(500).json({
                status: 500,
                verified: false
            });
        }   
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: "Course obj not being able to got from Firebase"
        });
    }
}