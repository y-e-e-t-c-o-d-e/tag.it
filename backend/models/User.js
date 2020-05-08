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
    
};
