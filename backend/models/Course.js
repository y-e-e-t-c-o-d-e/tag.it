// Install these dependencies before you run
const post = require("../models/Post");
const { db } = require("../shared/firebase")

class Course {
    constructor(props) {
        this.props = props;
    }


    getName() {
        return this.props.name;
    }

    getTerm() {
        return this.props.term;
    }

    getInstructorList() {
        return this.props.instructorList.slice(1, this.props.instructorList.length);
    }

    getUUID() {
        return this.props.uuid;
    }

    getTagList() {
        return this.props.tagList.slice(1, this.props.tagList.length);
    }

    getStudentList() {
        return this.props.studentList.slice(1, this.props.studentList.length);
    }

    getPostList() {
        return this.props.postList.slice(1, this.props.postList.length);
    }


    addTag = async (tagId) => {
        this.props.tagList.push(tagId);
        await this.push();
    }

    addStudent = async (userId) => {
        this.props.studentList.push(userId);
        await this.push();
    }

    addInstructor = async (userId) => {
        this.props.instructorList.push(userId);
        await this.push();
    }

    addPost = async (postId) => {
        this.props.postList.push(postId);

        await this.push();
    }


    getPostsWithTag = async (tagId) => {
        let list = this.getPostList();
        const posts = [];
        for (let i = 0; i < list.length; i ++) {
            // get each post object from firebase
            //console.log(list[i]);
            const currentPost = await post.getPostById(list[i]);
            const tagList = await currentPost.getTagList();
            for (let j = 0; j < tagList.length; j ++) {
                if (tagList[j] === tagId) {
                    posts.push(currentPost);
                    break;
                }
            }
        }
        return posts;
    }

    getPostsWithMultipleTags = async (tagList) => {
        let posts = {};
        for(let i = 0; i < tagList.length; i++) {
            let newPosts = await this.getPostsWithTag(tagList[i]);
            newPosts.forEach(post => {
                posts[post.getUUID()] = post;
            })
        };
        return Object.values(posts);
    }

    /**
     * Update a given post's data fields.
     * 
     * @param updateParams - Object consisting of keys & values that will be updated for the user
     */
    push = async () => {
        await db.ref("Courses").child(this.props.uuid).set({
            name: this.props.name, 
            term: this.props.term,
            uuid: this.props.uuid,
            instructorList: this.props.instructorList, 
            studentList: this.props.studentList,
            tagList: this.props.tagList,
            postList: this.props.postList,
        });
    } 
}

module.exports.pushCourseToFirebase = (updateParams) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.ref("Courses").child(updateParams["uuid"]).set({
                name: updateParams["name"], 
                term: updateParams["term"],
                uuid: updateParams["uuid"],
                instructorList: updateParams["instructorList"], 
                studentList: updateParams["studentList"],
                tagList: updateParams["tagList"],
                postList: updateParams["postList"],
            });
            resolve("Everything worked");
        } catch(e) {
            console.log("There was an error: " + e);
            reject("Something went wrong");
        }
        
    })
};



getCourseById = async (uuid) => {
    const ref = db.ref('Courses/' + uuid);

    return new Promise((resolve, reject) => {
        ref.once("value", function(snapshot) {
            const r = new Course(snapshot.val());
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

   
module.exports.Course = Course
module.exports.getCourseById = getCourseById
