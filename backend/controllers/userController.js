const user = require("../models/User");

exports.addUser = async (req, res, next) => {
    // Adding user to Firebase logic here
    user.getUser("some random UUID");
    res.status(200).send("Added user.")
};

exports.updateUser = async (req, res, next) => {
    // Updatea a user's field
    res.status(200).send("Updated user.");
};