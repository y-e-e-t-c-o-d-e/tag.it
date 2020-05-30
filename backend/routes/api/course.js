const express = require('express');
const router = express.Router();
const courseController = require("../../controllers/courseController");

// Matches with "/api/course"
router.route("/")
    .post(courseController.addCourse) // Create
    .get(courseController.getAllCourses) // Read
    .put(courseController.updateCourse) // Update

// Matches with "/api/course/:courseid/:inviteid"
router.route("/:courseid/:inviteid")
    .get(courseController.verifyCourse)

// Matches with "/api/course/courseId"
router.route("/:courseId")
    .get(courseController.getCourseInfo)
    .delete(courseController.deleteCourse)
module.exports = router;
