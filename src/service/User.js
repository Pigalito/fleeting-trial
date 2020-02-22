'use strict';

/**
 * This file contains functions used for dealing with users such as retrieval and creation
 */

const userModel = require('../model/User');
const ErrorResponse = require('../domain/ErrorResponse');

/**
 * Gets the user specified by the input username
 *
 * @param username
 * @returns user        {username, email, type}
 * @throws ErrorResponse if user cannot be found
 */
function getUser(username) {
    const user = userModel.getUserById(username);

    if(!user){
        throw new ErrorResponse(404, "user not found", ErrorResponse.codes.NOT_FOUND)
    }

    return user;
}

/**
 * Creates the user using info in the user object
 *
 * @param user      {username, email, type, password}
 * @returns {*}
 * @throws ErrorResponse if the username or email already exist in the table
 */
function createUser(user) {
    const usernameDuplicateCheck = userModel.getUserById(user.username);
    if(usernameDuplicateCheck) throwDuplicateException('username');

    const emailDuplicateCheck = userModel.getUserByEmail(user.email);
    if(emailDuplicateCheck) throwDuplicateException('email');

    return userModel.addUser(user);
}

function throwDuplicateException(field) {
    throw new ErrorResponse(400, "value already exists",
        ErrorResponse.codes.DUPLICATE_VALUES,
        [{field: field, status: ErrorResponse.fieldStatuses.DUPLICATE}]);
}

module.exports = {
    createUser,
    getUser
};