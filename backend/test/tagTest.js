const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const post = require("../models/Post");
const user = require("../models/User");
const tag = require("../models/Tag");
 
// Tag test suite
describe('tag', () => {
   let key;
   let testTag;
 
   // Setup function before test is run
   before(async () => {
       console.log("Setup for Tag Test Suite")
       const tagParams = {
           name: "pa1",
           numUsed: "3",
           parentTag: "dummy_parent",
           subTags: ["dummy_tag"],
           course: "course1",
           postList: ["post2"],
       }
 
       try {
           key = await tag.pushTagToFirebase(tagParams);
           testTag = await tag.getTagById(key);
       } catch(e) {
           console.log(e);
       }
   });
 
   // Teardown function after test is run
   after(async () => {
       console.log("Teardown for Tag Test Suite");
       tag.deleteTagByID(key)
   });
 
 
   it('should get testTag from firebase', async () => {
       expect(testTag.props.name).to.equal("pa1");
   })

   
    const sleep = (milliseconds) => {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
        }
    }
 
   it('should add a post to testTag in firebase', async() => {   
        await testTag.addPost('post3');
        let list = await testTag.getPostList();
        expect(list.length).to.equal(2);
   })

   it('should add a post to testTag in firebase and not get confused by async stuff', async() => {   
        const upToDateTag = await tag.getTagById(testTag.getUUID());
        await upToDateTag.addPost('post4');
        await testTag.addPost('post5');
        let list = await testTag.getPostList();
        expect(list.length).to.equal(4);
        //console.log("lkasdjfkjlasdflkaskldfkla;s" + list);
    })
 
   it('should remove a post from testTag in firebase', async() => {
       await testTag.removePost('post2');
       let list = await testTag.getPostList();
       expect(list.length).to.equal(3);
   })

   it('should remove a post from testTag in firebase and not get wrecked by async changes', async() => {
        const upToDateTag = await tag.getTagById(testTag.getUUID());
        await upToDateTag.removePost('post1');
        await testTag.removePost('post3');
        let list = await testTag.getPostList();
        expect(list.length).to.equal(2);
    })
 
   it('should increment testTag numUsed in firebase', async() => {
       await testTag.incrementNumUsed();
       expect(await testTag.getNumUsed()).to.equal(4);
   })
 
   it('should update testTag name in firebase', async() => {
       await testTag.updateName("HW4");
       expect(await testTag.getName()).to.equal("HW4");
   })
 
  
   it('should add a subtag to testTag in firebase', async() => {
       const tagParams2 = {
           name: "pa1b",
           numUsed: "1",
           parentTag: "dummy_parent",
           subTags: ["dummy_tag"],
           course: "course1",
           postList: ["post1, post2, post8"],
       }
 
       try {
           key2 = await tag.pushTagToFirebase(tagParams2);
       } catch(e) {
           console.log(e);
       }
       let subTags = await testTag.getSubTags();
       expect(subTags.length).to.equal(0);
       await testTag.addSubTag(key2);
       subTags = await testTag.getSubTags();
       expect(subTags.length).to.equal(1);
       testTag2 = await tag.getTagById(key2);
       expect(await testTag2.getParentTag()).to.equal(testTag.getUUID());
      
       tag.deleteTagByID(key2)
   })
 
  
   it('should remove a subtag from testTag in firebase', async() => {
       const tagParams3 = {
           name: "pa1d",
           numUsed: "1",
           parentTag: "dummy_parent",
           subTags: ["dummy_tag"],
           course: "course1",
           postList: ["post1, post3, post6"],
       }
 
       try {
           key3 = await tag.pushTagToFirebase(tagParams3);
           testTag3 = await tag.getTagById(key3);
       } catch(e) {
           console.log(e);
       }
       await testTag.addSubTag(key3);
       await testTag.removeSubTag(key3);
       let subTags = await testTag.getSubTags()
       expect(subTags.length).to.equal(1);
       expect(await testTag3.getParentTag()).to.equal("dummy_parent");
       tag.deleteTagByID(key3);
   })
});
