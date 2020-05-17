const express = require('express');
const { authenticated } = require('./auth');
const router = express.Router();
const exampleController = require("../../controllers/exampleController");
const userRoutes = require("./user");
const postRoutes = require("./post");
const courseRoutes = require("./course");
const commentRoutes = require("./comment");
const tagRoutes = require("./tag");

/* GET home page. */
router.get('/', exampleController.handleLogic); // TODO: Get rid of this controller.
router.get('/protected', authenticated, (req, res, next) => {
    // we now have req.user!
    res.status(200);
    res.send("Authenticated access to protected!")
})

// Object routes
router.use("/user", authenticated, userRoutes);
router.use("/post", authenticated, postRoutes);
router.use("/course", authenticated, courseRoutes);
router.use("/comment", authenticated, commentRoutes);
router.use("/tag", authenticated, tagRoutes);

module.exports = router;