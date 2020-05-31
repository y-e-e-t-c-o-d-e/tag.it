 
// Install these dependencies before you run
const user = require("./User");
const post = require("./Post");
const db = require("../shared/firebase").db;
 
 
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
        return this.props.subTags.slice(1, this.props.subTags.length);
    }
    getUUID() {
        return this.props.uuid;
    }

    updateName = async(newName) => {
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
        await this.updatePostList();
        this.props.postList.push(postId);
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
        //console.log(subTag);
        subTag.removeParentTag();
        //console.log('Should be true' + await this.updateSubTagList());
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
               numUsed: updateParams["numUsed"],
               parentTag: updateParams["parentTag"],
               uuid: (await tagRef).key,
               subTags: updateParams["subTags"],
               course: updateParams["course"],
               postList: updateParams["postList"]
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
 
deleteTagByID = async (uuid) => {
  
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
module.exports.deleteTagByID = deleteTagByID
