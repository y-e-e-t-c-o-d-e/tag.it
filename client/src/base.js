import * as firebase from "firebase";
import firebaseConfig from "./firebaseConfig";

const db = firebase.initializeApp(firebaseConfig);

export default db;