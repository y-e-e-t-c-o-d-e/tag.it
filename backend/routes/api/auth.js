const express = require('express');
const getUserById = require("../../models/User").getUserById;
const { Unauthorized, NotFound } = require("../../shared/error");
/**
 * Middleware function that determines if a user is authenticated and assigns req.user to their user info from the db.
 * Auth header should be included in the 'Authorization' request header in the form of 'Bearer <TOKEN>'.
 */
const authenticated = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return next(new Unauthorized());
    }
    
    const authHead = authHeader.split(' ');
    const invalidAuthFormat = authHead.length !== 2 || authHead[0] !== 'Bearer' || authHead[1].length === 0;
    if (invalidAuthFormat) {
        return next(new Unauthorized());
    }
    
    const userId = authHead[1];
    req.userId = userId;
    try {
        req.user = await getUserById(userId);
    } catch(e) {
        return next(new NotFound());
    }

    next(); // for now, accept all requests
};

module.exports = { authenticated };
