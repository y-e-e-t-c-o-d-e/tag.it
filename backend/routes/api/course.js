const express = require('express');
const router = express.Router();
const courseController = require("../../controllers/courseController");

// Matches with "/api/course"
router.route("/")
    .post(courseController.addCourse) // Create
    .get(courseController.getAllCourses) // Read
    .put(courseController.updateCourse) // Update

// Matches with "/api/course/:courseId"
router.route("/:courseId")
    .get(courseController.getCourseInfo)
    .delete(courseController.deleteCourse)

router.route("/:courseId/:userId")
    .delete(courseController.removeUser)

router.route("/:courseId/users")
    .get(courseController.getCourseUsers)

router.route("/:courseId/pending/:email")
    .delete(courseController.deletePendingUser)

// Matches with "/api/course/:courseId/invite"
router.route("/:courseId/invite")
    .post(courseController.sendEmail)

// Matches with "/api/course/:courseid/:inviteid"
router.route("/:courseid/invite/:inviteid")
    .get(courseController.verifyCourse)

module.exports = router;
