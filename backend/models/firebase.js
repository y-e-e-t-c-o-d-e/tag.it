// Firebase Dependencies
const firebase = require("firebase");
const config = require("./firebaseConfig");
firebase.initializeApp(config);
const db = firebase.database();

module.exports = {
    db: db
};