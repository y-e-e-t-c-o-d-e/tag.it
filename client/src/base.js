import * as firebase from "firebase";

const db = firebase.initializeApp({
    apiKey: "AIzaSyDVM7CqM0vTxdWv5ABTZflTHwoEmFWc1sk",
    authDomain: "cse110firebase-5877e.firebaseapp.com",
    databaseURL: "https://cse110firebase-5877e.firebaseio.com",
    projectId: "cse110firebase-5877e",
    storageBucket: "cse110firebase-5877e.appspot.com",
    messagingSenderId: "1058998347390",
    appId: "1:1058998347390:web:a033a95276f16e6fba5a2f",
    measurementId: "G-33TB200CDN"
});

export default db;
export const provider = new firebase.auth.GoogleAuthProvider();