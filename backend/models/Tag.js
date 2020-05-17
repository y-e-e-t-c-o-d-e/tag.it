 
// Install these dependencies before you run
const user = require("./User");
const post = require("./Post");
<<<<<<< HEAD
const db = require("../shared/firebase").db;
 
 
=======
const db = require("./firebase").db;


>>>>>>> Pulls out the firebase dependencies to avoid initialization issues
class Tag {
    constructor(props) {
        //super(props);
        this.props = props;
    }

    /**
     * normal getters and setters
     */

    getName = async() => {
        return this.props.name;
    }

    getNumUsed = async() => {
        return this.props.numUsed;
    }
    getCourse = async() => {
        return this.props.course;
    }
    getParentTag = async() => {
        let currentTag = await getTagById(this.props.uuid);
        return (await currentTag).props.parentTag;
    }
    getPostList = async() => {
        let currentTag = await getTagById(this.props.uuid);
        let currentList = currentTag.props.postList;
        if (currentList[0] == "dummy_post") {
            return currentList.slice(1, currentList.length);
        }
        return currentList;
        
    }
    getSubTags = async() => {
        let currentTag = await getTagById(this.props.uuid);
        let currentList = currentTag.props.subTags;
        if (currentList[0] == "dummy_tag") {
            return currentList.slice(1, currentList.length);
        }
        return currentList;
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
        await subTag.setParentTag(this.props.uuid);
        this.props.subTags.push(subTag.getUUID());
        await this.push();
    }

    removeSubTag = async(subTagId) => {
        const subTag = await getTagById(subTagId);
        await subTag.removeParentTag();
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
            const tagRef = db.ref("Tags").push();
            await tagRef.set({
                name: updateParams["name"], 
                numUsed: "postList" in updateParams ? updateParams["postList"].length : 0,
                parentTag: "parentTag" in updateParams ? updateParams["parentTag"] : "dummy_parent", 
                uuid: (await tagRef).key,
                subTags: "subTags" in updateParams ? updateParams["subTags"] : ["dummy_tag"],
                course: updateParams["course"],
                postList: "postList" in updateParams ? updateParams["postList"] : ["dummy_post"],
            });
            resolve((await tagRef).key);
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
}

deleteTagById = async (uuid) => {
    
    const ref = db.ref('Tags/' + uuid);
    ref.remove()
    .then(function() {
        console.log("Remove succeeded.")
      })
      .catch(function(error) {
        console.log("Remove failed: " + error.message)
      });
}


module.exports.Tag = Tag
module.exports.getTagById = getTagById
module.exports.deleteTagById = deleteTagById
