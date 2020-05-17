const express = require('express');
const router = express.Router();
const commentController = require("../../controllers/commentController");

// Matches with "/api/comment"
router.route("/")
    .post(commentController.addComment) // Create
    .get(commentController.getComment) // Read
    .put(commentController.updateComment) // Update

module.exports = router;
