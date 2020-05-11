const firebase = require("firebase");
const config = require("./firebaseConfig");
const app = firebase.initializeApp(config);
const db = firebase.database();

class Post {
    constructor(props) {
        //super(props);
        this.props = props;
    }

    /**
     * Update a given user's data fields.
     * 
     * @param updateParams - Object consisting of keys & values that will be updated for the user
     */



    /**
     * Update a given post's data fields.
     * 
     * @param updateParams - Object consisting of keys & values that will be updated for the user
     */
    push = async () => {
        await db.ref("Posts").child(this.props.uuid).set({
            title: this.props.title, 
            content: this.props.content,
            author: this.props.author, 
            uuid: this.props.uuid,
            tagList: this.props.tagList,
            commentList: this.props.commentList,
            followingList: this.props.followingList,
            isAnnouncement: this.props.isAnnouncement,
            isPinned: this.props.isPinned,
            isAnonymous: this.props.isAnonymous,
            isPrivate: this.props.isPrivate,
            isResolved: this.props.isResolved,
            isInstructor: this.props.isInstructor,
            score: this.props.score,
            course: this.props.course
        });
    } 
}

module.exports.pushPostToFirebase = (updateParams) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.ref("Posts").child(updateParams["uuid"]).set({
                title: updateParams["title"], 
                content: updateParams["content"],
                author: updateParams["author"], 
                uuid: updateParams["uuid"],
                tagList: updateParams["tagList"],
                commentList: updateParams["commentList"],
                followingList: updateParams["followingList"],
                isAnnouncement: updateParams["isAnnouncement"],
                isPinned: updateParams["isPinned"],
                isAnonymous: updateParams["isAnonymous"],
                isPrivate: updateParams["isPrivate"],
                isResolved: updateParams["isResolved"],
                isInstructor: updateParams["isInstructor"],
                score: updateParams["score"],
                course: updateParams["course"]
            });
            resolve("Everything worked");
        } catch(e) {
            console.log("There was an error: " + e);
            reject("Something went wrong");
        }
        
    })
};



getPostById = async (uuid) => {
    const ref = db.ref('Posts/' + uuid);

    return new Promise((resolve, reject) => {
        ref.once("value", function(snapshot) {
            const r = new Post(snapshot.val());
            //console.log(r.props.name);
            resolve(r);
        }, function (errorObject) {
            reject(errorObject);
        })
    }) 


    /**
     * This is for reference to the callback but, we're using promises now.
     */

    // // Attach an asynchronous callback to read the data at our posts reference
    // await ref.once("value", function(snapshot) {
    //     const r = new User(snapshot.val());
    //     console.log(r.props.name);
    //     callback(r);
    // }, function (errorObject) {
    //     console.log("The read failed: " + errorObject.code);
    // })
}

   
module.exports.Post = Post
module.exports.getPostById = getPostById
