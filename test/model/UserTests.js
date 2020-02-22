'use strict';

const sinon = require('sinon');
const alasql = require('alasql');

const user = require('../../src/model/User');

const passwordUtils = require('../../src/utils/PasswordUtils');
let generatePasswordAndSaltStub;

const initialiseDB = require('../../src/initialiseDB');
initialiseDB();

exports['User model class tests'] = {

    setUp: done => {
        generatePasswordAndSaltStub = sinon.stub(passwordUtils, 'generatePasswordHashAndSalt');
        done();
    },

    tearDown: done => {
        generatePasswordAndSaltStub.reset();
        generatePasswordAndSaltStub.restore();
        done();
    },

    'addUser creates a new user in the database': test => {
        generatePasswordAndSaltStub.returns({
            passwordHash: '123456',
            salt: '54df1dy791'
        });

        user.addUser({
            username: 'User1',
            email: 'User@user.com',
            type: 'CUSTOMER',
            password: 'pass55'
        });

        const createdUser = alasql(`SELECT * FROM users WHERE username = 'user1'`)[0];

        test.ok(generatePasswordAndSaltStub.calledWith('pass55'));
        test.deepEqual(createdUser, { username: 'user1',
            email: 'user@user.com',
            password: '123456',
            salt: '54df1dy791',
            type: 'CUSTOMER' });

        test.done();
    },

    'getUserById returns undefined if there is no matching username in db': test => {
        test.equal(user.getUserById('fakeUser'), undefined);
        test.done();
    },

    'getUserById returns non sensitive details for the user specified': test => {
        const returnedUser = user.getUserById('Alison');

        test.deepEqual(returnedUser, {
            username: 'alison',
            email: 'alison@aol.com',
            type: 'ADMIN'
        });
        test.done();
    },

    'getUserByEmail returns undefined if there is no match email in db': test => {
        test.equal(user.getUserByEmail('fakeEMail'), undefined);
        test.done();
    },

    'getUserByEmail returns non sensitive details for the user with the specified email': test => {
        const returnedUser = user.getUserByEmail('Alison@aol.com');

        test.deepEqual(returnedUser, {
            username: 'alison',
            email: 'alison@aol.com',
            type: 'ADMIN'
        });
        test.done();
    },

    'getUserPasswordAndSalt returns undefined if there is no match email in db': test => {
        test.equal(user.getUserPasswordAndSalt('fakeUser'), undefined);
        test.done();
    },

    'getUserPasswordAndSalt returns non sensitive details for the user with the specified email': test => {
        const returnedUser = user.getUserPasswordAndSalt('user1');

        test.deepEqual(returnedUser, {
            password: '123456',
            salt: '54df1dy791'
        });
        test.done();
    },

    'userTypes returns all the valid userTypes': test => {
        test.deepEqual(user.userTypes, {
            ADMIN: 'ADMIN',
            CUSTOMER: 'CUSTOMER'
        });

        test.done();
    }
};