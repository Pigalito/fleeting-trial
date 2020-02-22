'use strict';

const alasql = require('alasql');
const passwordUtils = require('../utils/PasswordUtils');

const tableName = 'users';

/**
 * Model class for our users that provides database calls
 */
class User {

    static addUser(user){
        const passwordInfo = passwordUtils.generatePasswordHashAndSalt(user.password);
        return alasql(`INSERT INTO ${tableName} VALUES ('${user.username.toLowerCase()}',
            '${user.email.toLowerCase()}','${passwordInfo.passwordHash}','${passwordInfo.salt}','${user.type}')`)
    }

    static getUserById(username) {
        // Username should be unique for each row so can get away with returning only first record in list
        return alasql(`SELECT username, email, type FROM ${tableName} WHERE username = '${username.toLowerCase()}'`)[0];
    }

    static getUserByEmail(email) {
        // Email should be unique for each row so can get away with returning only first record in list
        return alasql(`SELECT username, email, type FROM ${tableName} WHERE email = '${email.toLowerCase()}'`)[0];
    }

    static getUserPasswordAndSalt(username) {
        return alasql(`SELECT password, salt FROM ${tableName} WHERE username = '${username.toLowerCase()}'`)[0];
    }

    static get userTypes(){
        return {
            ADMIN: 'ADMIN',
            CUSTOMER: 'CUSTOMER'
        }
    }

}

module.exports = User;