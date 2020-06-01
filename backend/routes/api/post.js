const express = require('express');
const router = express.Router();
const postController = require("../../controllers/postController");

// Matches with "/api/post"
router.route("/")
    .post(postController.addPost) // Create
    .get(postController.getPost) // Read
    .put(postController.updatePost) // Update

// Matches with "/api/post/follow"
router.route("/follow")
    .post(postController.toggleFollow)

// Matches with "/api/post/like"
router.route("/like")
    .post(postController.toggleLike)
module.exports = router;