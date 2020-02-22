'use strict';

/**
 * This file contains functions for generating and authenticating authorization tokens
 */

const crypto = require('crypto');
const base64url = require('base64url');

const passwordUtils = require('../utils/PasswordUtils');
const userModel = require('../model/User');
const ErrorResponse = require('../domain/ErrorResponse');

/**
 * Verifies that the username exists and the password is correct during user sign in
 *
 * @param username
 * @param password
 */
function verifyUsernameAndPassword(username, password) {
    const usernamePasswordCheck = userModel.getUserPasswordAndSalt(username);
    if(!usernamePasswordCheck) throwInvalidLoginException();

    const passwordHash = passwordUtils.generatePasswordHash(password, usernamePasswordCheck.salt);
    if(passwordHash !== usernamePasswordCheck.password) throwInvalidLoginException();
}

/**
 * Creates a JWT to be used when authorizing future requests
 *
 * @param username
 * @returns {string} A JWT
 */
function createAuthToken(username) {
    const jwtHashingKey = process.env.jwtKey;
    const user = userModel.getUserById(username);

    const now = Math.floor(new Date().getTime() / 1000);
    const timeInOneHour = now + 60 * 60;

    const header = {
        "alg": "HS256",
        "typ": "JWT"
    };

    const body = {
        "sub": username,
        "utype": user.type,
        "iat": now,
        "exp": timeInOneHour,
    };

    const encodedHeader = base64url(JSON.stringify(header));
    const encodedBody = base64url(JSON.stringify(body));

    const signature = crypto.createHmac('SHA256', jwtHashingKey).update(`${encodedHeader}.${encodedBody}`).digest('base64');

    return `${encodedHeader}.${encodedBody}.${signature}`;
}

/**
 * Function for verifying the JWT is valid and making sure that the requester has access to the call they made
 *
 * @param authorization     Authorization header from the request
 * @param username          Username from the path params in the request
 */
function verifyJwt(authorization, username) {

    let jwt;
    if(authorization && authorization.split(' ').length > 1){
        jwt = authorization.split(' ')[1];
    } else {
        throwUnauthorizedException()
    }

    const jwtHashingKey = process.env.jwtKey;
    const [encodedHeader, encodedBody, requestSignature] = jwt.split('.');

    //ensure the signature is correct
    const signature = crypto.createHmac('SHA256', jwtHashingKey).update(`${encodedHeader}.${encodedBody}`).digest('base64');
    if(signature !== requestSignature) throwUnauthorizedException();

    //ensure the token has not expired
    const body = JSON.parse(base64url.decode(encodedBody));
    const now = Math.floor(new Date().getTime() / 1000);
    if(body.exp < now) throwUnauthorizedException();

    //ensure the username matches the request, would be part of a separate check in a more complex application since checking
    //token validity and user permissions are quite different.
    if(body.sub.toLowerCase() !== username.toLowerCase() && body.utype !== userModel.userTypes.ADMIN) throw new ErrorResponse(403, "You do not have access to this resource", ErrorResponse.codes.FORBIDDEN);

}

function throwInvalidLoginException() {
    throw new ErrorResponse(400, "invalid username/password", ErrorResponse.codes.INVALID_LOGIN);
}

function throwUnauthorizedException() {
    throw new ErrorResponse(401, "UNAUTHORIZED", ErrorResponse.codes.UNAUTHORIZED);
}

module.exports = {
    verifyUsernameAndPassword,
    createAuthToken,
    verifyJwt
};