const firebase = require("firebase");
const config = require("./firebaseConfig");
const app = firebase.initializeApp(config);
const db = firebase.database();

module.exports = { app, db }