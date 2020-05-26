
// Install these dependencies before you run
const user = require("./User");
const post = require("./Post");
const db = require("./firebase").db;


class Tag {
    constructor(props) {
        //super(props);
        this.props = props;
    }

    /**
     * normal getters and setters
     */
    getName() {
        return this.props.name;
    }
    getNumUsed() {
        return this.props.numUsed;
    }
    getCourse() {
        return this.props.course;
    }
    getParentTag() {
        return this.props.parentTag;
    }
    getPostList() {
        return this.props.postList;
    }
    getSubTags() {
        return this.props.subTags;
    }
    getUUID() {
        return this.props.uuid;
    }

    updateName = async(newName) => {
        this.props.name = newName;
        await this.push();
    }

    incrementNumUsed = async() => {
        this.props.numUsed ++;
        await this.push();
    }

    decrementNumUsed = async() => {
        this.props.numUsed --;
        await this.push();
    }

    addPost = async(postId) => {
        this.props.postList.push(postId);
        await this.push();
    }
    removePost = async (postId) => {
        const index = this.props.postList.indexOf(postId);
        if (index != -1) {
            this.props.postList.splice(index, 1);
        }
        await this.push();
    }

    setParentTag = async(parentTagId) => {
        this.props.parentTag = parentTagId;
        await this.push();
    }

    removeParentTag = async() => {
        this.props.parentTag = "dummy_parent";
        await this.push();
    }

    addSubTag = async(subTagId) => {
        const subTag = await getTagById(subTagId);
        subTag.setParentTag(this.props.uuid);
        this.props.subTags.push(subTag.getUUID());
        await this.push();
    }

    removeSubTag = async(subTagId) => {
        const subTag = await getTagById(subTagId);
        subTag.removeParentTag();
        const index = this.props.subTags.indexOf(subTag.getUUID());
        if (index != -1) {
            this.props.subTags.splice(index, 1);
        }
        await this.push();

    }
    
    

    


    /**
     * Update a given tag's data fields.
     * 
     * @param updateParams - Object consisting of keys & values that will be updated for the user
     */
    push = async () => {
        await db.ref("Tags").child(this.props.uuid).set({
            name: this.props.name, 
            numUsed: this.props.numUsed,
            parentTag: this.props.parentTag, 
            uuid: this.props.uuid,
            subTags: this.props.subTags,
            course: this.props.course,
            postList: this.props.postList,
            
        });
    } 
}

module.exports.pushTagToFirebase = (updateParams) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.ref("Tags").child(updateParams["uuid"]).set({
                name: updateParams["name"], 
                numUsed: updateParams["numUsed"],
                parentTag: updateParams["parentTag"], 
                uuid: updateParams["uuid"],
                subTags: updateParams["subTags"],
                course: updateParams["course"],
                postList: updateParams["postList"]
            });
            resolve("Everything worked");
        } catch(e) {
            console.log("There was an error: " + e);
            reject("Something went wrong");
        }
        
    })
};



getTagById = async (uuid) => {
    const ref = db.ref('Tags/' + uuid);

    return new Promise((resolve, reject) => {
        ref.once("value", function(snapshot) {
            const r = new Tag(snapshot.val());
            //console.log(r.props.author);
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

   
module.exports.Tag = Tag
module.exports.getTagById = getTagById
