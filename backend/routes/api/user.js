const express = require('express');
const router = express.Router();
const userController = require("../../controllers/userController");

// TODO: Will update routes to match as few endpoints as possible. 

// Matches with "/api/user"
router.route("/")
    .get(userController.addUser) 

// Matches with "/api/user/update"
router.route("/update")
    .get(userController.updateUser)

module.exports = router;
