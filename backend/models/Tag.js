 
// Install these dependencies before you run
const Post = require("./Post");
const Course = require("./Course");
const db = require("../shared/firebase").db;
 
 
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
    getCourse = () => {
        return this.props.course;
    }
    getParentTag = async() => {
        let currentTag = await getTagById(this.props.uuid);
        return (await currentTag).props.parentTag;
    }
    getPostList() {
        if (this.props.postList[0] == "dummy_post") {
            return this.props.postList.slice(1, this.props.postList.length);
        }
        return this.props.postList;
        
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

    setName = async(newName) => {
        this.props.name = newName;
        await this.push();
    }

    incrementNumUsed = async() => {

        this.props.numUsed++;
        await this.push();
    }

    decrementNumUsed = async() => {
        this.props.numUsed --;
        await this.push();
    }

    arraysEqual = (a, b) => {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;
      
        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.
        // Please note that calling sort on an array will modify that array.
        // you might want to clone your array first.
      
        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
    }

    
    postListEqual = (otherTag) => {
        return this.arraysEqual(otherTag.props.postList, this.props.postList);
    }

    updatePostList = async () => {
        let tag = await getTagById(this.props.uuid);
        while(!this.postListEqual(tag)) {
            this.props.postList = tag.props.postList;
            tag = await getTagById(this.props.uuid);
        }
    }

    addPost = async(postId) => {
        const index = this.props.postList.indexOf(postId);
        if (index == -1) {
            await this.updatePostList();
            this.props.postList.push(postId);
        }
        await this.push();
    }

    removePost = async (postId) => {
        await this.updatePostList();
        const index = this.props.postList.indexOf(postId);
        if (index != -1) {
            this.props.postList.splice(index, 1);
        }
        await this.push();
    }


    setParentTag = async (parentTagId) => {
        this.props.parentTag = parentTagId;
        await this.push();
    }

    removeParentTag = async() => {
        this.props.parentTag = "dummy_parent";
        await this.push();
    }
    updateSubTagList = async () => {
        let tag = await getTagById(this.props.uuid);
        while(!this.subTagListEqual(tag)) {
            this.props.postList = tag.props.postList;
            tag = await getTagById(this.props.uuid);
        }
    }

    subTagListEqual = (otherTag) => {
        return this.arraysEqual(otherTag.props.subTags, this.props.subTags);
    }

    addSubTag = async (subTagId) => {
        const subTag = await getTagById(subTagId);
        subTag.setParentTag(this.props.uuid);
        await this.updateSubTagList();
        this.props.subTags.push(subTag.getUUID());
        await this.push();
    }

    removeSubTag = async(subTagId) => {
        const subTag = await getTagById(subTagId);
        if (subTag.props === null) return;
        await subTag.removeParentTag();
        await this.updateSubTagList();
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
            const tagRef = await db.ref("Tags").push();
            await tagRef.set({
                name: updateParams["name"], 
                numUsed: "postList" in updateParams ? updateParams["postList"].length : 0,
                parentTag: "parentTag" in updateParams ? updateParams["parentTag"] : "dummy_parent", 
                uuid: tagRef.key,
                subTags: "subTags" in updateParams ? updateParams["subTags"] : ["dummy_tag"],
                course: updateParams["course"],
                postList: "postList" in updateParams ? updateParams["postList"] : ["dummy_post"],
            });
            const courseObj = await Course.getCourseById(updateParams["course"]);
            await courseObj.addTag(tagRef.key);

            postList = updateParams["postList"] ? updateParams["postList"] : [];
            for (let postId of postList) {
                const currentPost = await Post.getPostById(postId);
                await currentPost.addTag(tagRef.key)
            }

            resolve(tagRef.key);
        } catch(e) {
            console.log("There was an error: " + e);
            reject("Something went wrong");
        }
        
    })
};
 
 
 
getTagById = async (uuid) => {
    const ref = db.ref(`Tags/${uuid}`);

    return new Promise((resolve, reject) => {
        ref.once("value", function(snapshot) {
            const r = new Tag(snapshot.val());
            resolve(r);
        }, function (errorObject) {
            reject(errorObject);
        })
    }) 
}

deleteTagById = async (uuid) => {
    const ref = db.ref(`Tags/${uuid}`);
    try{
        const tag = await this.getTagById(uuid);
        for (const postId of await tag.getPostList()) {
            const currentPost = await Post.getPostById(postId)
            await currentPost.removeTag(uuid);
        }

        const currentCourse = await Course.getCourseById(tag.getCourse());
        await currentCourse.removeTag(uuid)

        await ref.remove();
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}


module.exports.Tag = Tag
module.exports.getTagById = getTagById
module.exports.deleteTagById = deleteTagById
