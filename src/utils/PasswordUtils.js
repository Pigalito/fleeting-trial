'use strict';

/**
 * A collection of useful functions for dealing with passwords and their security
 */

const crypto = require('crypto');

/**
 * Generates a password hash and salt to store based on input password
 *
 * @param password
 * @returns {{salt: *, passwordHash: *}}
 */
function generatePasswordHashAndSalt(password) {
    const salt = generateRandomString(16);
    const passwordHash = generatePasswordHash(password, salt);
    return {
        salt: salt,
        passwordHash: passwordHash
    }
}

/**
 * Generates password hash based on input password and salt
 *
 * @param password
 * @param salt
 * @returns {*}
 */
function generatePasswordHash(password, salt) {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('hex');
}

function generateRandomString(length){
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
}

module.exports = {
    generatePasswordHashAndSalt,
    generatePasswordHash
};