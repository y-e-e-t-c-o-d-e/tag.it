const express = require('express');
const router = express.Router();
const userController = require("../../controllers/userController");

// Matches with "/api/user"
router.route("/")
    .post(userController.addUser) // Create
    .get(userController.getUser) // Read
    .put(userController.updateUser) // Update

// Matches with "/api/user/courseId"
router.route("/:courseId")   // regex? how do we format the courseID
    .post(userController.addUserToCourse)
    .get(userController.getUserType)
module.exports = router;
