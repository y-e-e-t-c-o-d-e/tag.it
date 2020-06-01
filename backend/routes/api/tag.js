const express = require('express');
const router = express.Router();
const tagController = require("../../controllers/tagController");

// Matches with "/api/tag"
router.route("/")
    .post(tagController.addAndRemoveTags) // Create
    .get(tagController.getTag) // Read
    .put(tagController.updateTag) // Update
    .delete(tagController.deleteTag)

module.exports = router;
