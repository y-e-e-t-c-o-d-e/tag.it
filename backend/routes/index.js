const express = require('express');
const { authenticated } = require('./auth');
const router = express.Router();
const exampleController = require("../controllers/exampleController");

/* GET home page. */
router.get('/', exampleController.handleLogic);
router.get('/protected', authenticated, (req, res, next) => {
    // we now have req.user!
    res.status(200);
    res.send("Authenticated access to protected!")
})

module.exports = router;