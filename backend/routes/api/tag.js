const express = require('express');
const router = express.Router();
const tagController = require("../../controllers/tagController");

// Matches with "/api/user"
router.route("/")
    .post(tagController.addTag) // Create
    .get(tagController.getTag) // Read
    .put(tagController.updateTag) // Update

module.exports = router;
