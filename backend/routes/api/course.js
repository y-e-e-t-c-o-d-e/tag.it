const express = require('express');
const router = express.Router();
const courseController = require("../../controllers/courseController");

// Matches with "/api/course"
router.route("/")
    .post(courseController.addCourse) // Create
    .get(courseController.getCourse) // Read
    .put(courseController.updateCourse) // Update

module.exports = router;
