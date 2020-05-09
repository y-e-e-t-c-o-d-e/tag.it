const firebase = require("firebase");
const config = require("./firebaseConfig");
const app = firebase.initializeApp(config);
const db = firebase.database();
/**
 * Retrieves a user object from Firebase. 
 * 
 * @param userUUID - Document ID of the user object in Firebase 
 * @return Promise object with the user information
 */
module.exports.getUser = (userUUID) => {
    return new Promise((resolve, reject) => {
        // TODO: Firebase logic goes in here. 
        resolve({ "name": "tag.it" }); // Example of how to return success in a Promise
    });
};

/**
 * Uupdate a given user's data fields.
 * 
 * @param updateParams - Object consisting of keys & values that will be updated for the user
 */
module.exports.updateUser = (updateParams) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.ref("Users").child("user2").set({name: "gary"});
            resolve("Everything worked");
    
        } catch (e) {
            console.log(e);
            reject("Something went wrong");
        }
    });
    
};

module.exports.pushUserToFirebase = (updateParams) => {
    var name = updateParams['name'];
    var email = updateParams['email'];
    var uuid = updateParams['uuid'];
    return new Promise(async (resolve, reject) => {
        try {
            await db.ref("Users").child(uuid).set({
                name: name, 
                email: email, 
                uuid: uuid, 
                studentCourseList: ["dummy_course_id"], 
                instructorCourseList: ["dummy_course_id"],
                postList: ["dummy_post_id"],
                commentList: ["dummy_comment_id"],
                followingList: ["dummy_post_id"],
                icon: "anonymous.jpg"
            });
            resolve("Everything worked");
        } catch(e) {
            console.log("There was an error: " + e);
            reject("Something went wrong");
        }
        
    })
};

// getStudentCourseList(callback) {
//     var userId = "user1";
//     var userRef = db.database().ref("Users/"+userId+"/studentCourseList");
//     userRef.on('value', function(snapshot) {
//         callback(snapshot.val());
//     });
// }

// async addStudentCourse(event) {
//     var courseId = "course2";
//     var userId = "user1";
//     var userRef = db.database().ref("Users/"+userId+"/studentCourseList");
//     getStudentCourseList(
//         (courseList) => {
//             courseList.push(courseId)
//             db.database().ref("Users").child(userId).child("studentCourseList").set(courseList);
//         },
//     );
// }