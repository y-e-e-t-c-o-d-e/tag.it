const express = require('express');
const router = express.Router();
const userController = require("../../controllers/userController");

// Matches with "/api/user"
router.route("/")
    .post(userController.addUser) // Create
    .get(userController.getUser) // Read
    .put(userController.updateUser) // Update

module.exports = router;
