import * as firebase from "firebase/app";
import "firebase/auth"
import firebaseConfig from "./firebaseConfig";

const db = firebase.initializeApp(firebaseConfig);

export default db;