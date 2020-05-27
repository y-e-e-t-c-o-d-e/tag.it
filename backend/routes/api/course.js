const express = require('express');
const router = express.Router();
const courseController = require("../../controllers/courseController");

// Matches with "/api/course"
router.route("/")
    .post(courseController.addCourse) // Create
    .get(courseController.getAllCourses) // Read
    .put(courseController.updateCourse) // Update

// matches with "/api/course/:courseid/:inviteid"
router.route("/:courseid/:inviteid")
    .get(courseController.verifyCourse)

module.exports = router;
