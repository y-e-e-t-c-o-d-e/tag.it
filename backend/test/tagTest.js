const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const post = require("../models/Post");
const user = require("../models/User");
const tag = require("../models/Tag");

// Tag test suite 
describe('tag', () => {

    // Setup function before every test is run 
    beforeEach(() => {

    });

    // Teardown function after every test is run 
    afterEach(() => {

    });

    it('should create a new tag in Firebase', async () => {
        const tagParams = {
            name: "pa1", 
            numUsed: "3",
            parentTag: "dummy_parent", 
            uuid: "tag1",
            subTags: ["dummy_tag"],
            course: "course1",
            postList: ["post2"],
        }

        try {
            const result = await tag.pushTagToFirebase(tagParams);
            expect(result).to.equal("Everything worked");
            //expect(1).to.equal(1);
        } catch(e) {
            console.log(e);
        }  
    })

    it('should get tag from firebase', async () => {
        const uuid = 'tag1';
        const testTag = await tag.getTagById('tag1');
        const subTag = await tag.getTagById('tag2');
        testTag.addSubTag(subTag);
        //testTag.addPost("post2");
        expect(testTag.props.name).to.equal("pa1");
    })

    
});