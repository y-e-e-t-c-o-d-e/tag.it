const express = require('express');
const router = express.Router();
const postController = require("../../controllers/postController");

// Matches with "/api/post"
router.route("/")
    .post(postController.addPost) // Create
    .get(postController.getPost) // Read
    .put(postController.updatePost) // Update

module.exports = router;