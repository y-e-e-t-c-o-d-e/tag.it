const user = require("../models/User");
const course = require("../models/Course");

exports.addUser = async (req, res) => {
    // Check that required data is given
    const bodyParams = req.body;
    if (!("name" in bodyParams && "email" in bodyParams && "uuid" in bodyParams)) {
        res.status(422).json({
            status: 422,
            error: "Missing one of the following parameters: name, email, or uuid"
        });
        return;
    };

    try {
        await user.pushUserToFirebase(bodyParams);
        res.status(200).send(`Added user ${bodyParams.uuid}`)
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: "Server could not push to firebase"
        })
    }
};

exports.getUser = async (req, res) => {
    const userUUID = req.query.userUUID;
    if (!userUUID) {
        res.status(200).json(req.user.props);
    };

    // Grabs the user based on the userUUID. If fails, responds with an error.
    try {
        const userObj = await user.getUserById(userUUID);
        // get all the courses
        userObj.props.filledInStudentCourseList = await Promise.all(userObj.getStudentCourseList().map(async uuid => {
            const toReturn =  (await course.getCourseById(uuid)).props;
            return toReturn
        }))

        userObj.props.filledInInstructorCourseList = await Promise.all(userObj.getInstructorCourseList().map(async uuid => {
            const toReturn =  (await course.getCourseById(uuid)).props;
            return toReturn
        }))

        res.status(200).json(userObj.props);
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
};

// We can add more deletions in here when we have more remove methods in User model
exports.updateUser = async (req, res) => {
    // Object of fields and values to update in the user object
    const bodyParams = req.body;
    const userObj = req.user;

    try {
        if ("name" in bodyParams) {
            userObj.setName(bodyParams["name"]);
        }
        if ("email" in bodyParams) {
            userObj.setEmail(bodyParams["email"]);
        }
        if ("studentCourse" in bodyParams) {
            userObj.addStudentCourse(bodyParams["studentCourse"]);
        }
        if ("instructorCourse" in bodyParams) {
            userObj.addInstructorCourse(bodyParams["instructorCourse"]);
        }
        if ("post" in bodyParams) {
            userObj.addPost(bodyParams["post"]);
        }
        if ("comment" in bodyParams) {
            userObj.addComment(bodyParams["comment"]);
        }
        if ("followedPost" in bodyParams) {
            userObj.addFollowedPost(bodyParams["followedPost"]);
        }
        if ("likedPost" in bodyParams) {
            userObj.addLikedPost(bodyParams["likedPost"]);
        }
        if ("rmLikedPost" in bodyParams) {
            userObj.removeLikedPost(bodyParams["rmLikedPost"]);
        }
        if ("likedComment" in bodyParams) {
            userObj.addLikedComment(bodyParams["likedComment"]);
        }
        if ("rmLikedComment" in bodyParams) {
            userObj.removeLikedComment(bodyParams["rmLikedComment"]);
        }
        if ("icon" in bodyParams) {
            userObj.addIcon(bodyParams["icon"]);
        }
        res.status(200).send("Updated user.");
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
};

// Defaults to adding as a student. If req body contains "type" : "instructor", adds user as instructor
exports.addUserToCourse = async (req, res) => {
    const courseUUID = req.params.courseId;
    const bodyParams = req.body;

    // If user id is given, add that user to the course. Otherwise, add authenticated user.
    let userToAdd = bodyParams["userId"];
    let userObj = req.user;

    if (!courseUUID || !userObj) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseUUID or userUUID"
        });
        return;
    };

    if (userToAdd) {
        userObj = await user.getUserById(userToAdd);
    }

    try {
        let courseObj = await course.getCourseById(courseUUID);

        if ("type" in bodyParams && bodyParams["type"] == "instructor") {
            await userObj.addInstructorCourse(courseObj.getUUID());
            res.status(200).send("Added user as instructor to course " + courseObj.getUUID());
        } else {
            await courseObj.addStudent(userObj.getUUID());
            await userObj.addStudentCourse(courseObj.getUUID());
            res.status(200).send("Added user as student to course " + courseObj.getUUID());
        }
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e.message
        });
    };
};

exports.getUserType = async (req, res) => {
    const courseUUID = req.params.courseId;
    const userObj = req.user;

    if (!courseUUID || !userObj) {
        res.status(422).json({
            status: 422,
            error: "Missing parameter: courseUUID or user"
        });
        return;
    };

    // Grabs the user's type based on the courseUUID. If fails, responds with an error.
    try {
        const courseObj = await course.getCourseById(courseUUID);

        if (courseObj.getInstructorList().indexOf(userObj.getUUID()) != -1) {
            res.status(200).json({
                type: "Instructor"
            });
        } else if (courseObj.getStudentList().indexOf(userObj.getUUID()) != -1) {
            res.status(200).json({
                type: "Student"
            });
        } else {
            res.status(200).json({
                error: "User not in this class"
            });
        }
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
};

exports.deleteUser = async (req, res) => {
    let userUUID = req.query.userUUID;
    if (!userUUID) {
        userUUID = req.user.props.uuid;
    };

    // Grabs the user based on the userUUID. If fails, responds with an error.
    try {
        user.deleteUserByID(userUUID);
        res.status(200).send("removed user with the following userUUID:" + userUUID)
    } catch (e) {
        res.status(410).json({
            status: 410,
            error: e
        });
    };
};