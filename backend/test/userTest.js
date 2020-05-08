const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const user = require("../models/User");

// User test suite 
describe('user', () => {

    // Setup function before every test is run 
    beforeEach(() => {

    });

    // Teardown function after every test is run 
    afterEach(() => {

    });

    it('should succeed and get user info given uuid', async () => {
        const {name} = await user.getUser('some UUID');
        expect(name).to.equal("tag.it");
    });
});