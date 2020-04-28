const express = require('express');
const router = express.Router();
const exampleController = require("../controllers/exampleController");

/* GET home page. */
router.get('/', exampleController.handleLogic);

module.exports = router;