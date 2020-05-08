const express = require('express');

/**
 * Middleware function that determines if a user is authenticated and assigns req.user to their user info from the db.
 * Auth header should be included in the 'Authorization' request header in the form of 'Bearer <TOKEN>'.
 */
const authenticated = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        res.status(401);
        res.json({
            status: 401,
            message: "Unauthorized"
        })
        return;
    }
  
    const authHead = authHeader.split(' ');
    const invalidAuthFormat = authHead.length !== 2 || authHead[0] !== 'Bearer' || authHead[1].length === 0;
    if (invalidAuthFormat) {
        res.status(401);
        res.json({
            status: 401,
            message: "Unauthorized"
        })
    }
  
    const userId = authHead[1];
    req.userId = userId;
    // check if userId corresponds to user in DB
    // uncomment these lines when User model is completed
    // User.findByUUID(userId).then(user => {
    //     req.user = user;
    //     console.log(`user authentication completed for ${user.uuid} (${user.name}) from request: ${req.id}`);
    //     next();
    // }).catch(error => {
    //     return next(new error.Unauthorized());
    // })

    next(); // for now, accept all requests
};

module.exports = { authenticated };
