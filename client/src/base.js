import * as firebase from "firebase";

const db = firebase.initializeApp({
    apiKey: "AIzaSyD9jl-q7A4p30mdJwfayjlHiXPakxZ4hZc",
    authDomain: "tagit110.firebaseapp.com",
    databaseURL: "https://tagit110.firebaseio.com",
    projectId: "tagit110",
    storageBucket: "tagit110.appspot.com",
    messagingSenderId: "44092496508",
    appId: "1:44092496508:web:6cfdf6a296511c82a707f9",
    measurementId: "G-ZZ28HF6EW6"
});

export default db;
export const provider = new firebase.auth.GoogleAuthProvider();