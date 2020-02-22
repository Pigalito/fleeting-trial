'use strict';

const sinon = require('sinon');

const API = require('../../src/service/API');

const ErrorResponse = require('../../src/domain/ErrorResponse');

const statusStub = sinon.stub();
const sendStub = sinon.stub();

const responseStub = {
    status: statusStub
};

statusStub.returns({
    send: sendStub
});

exports['API service tests'] = {

    setUp: done => {
        statusStub.returns({send: sendStub});
        done();
    },

    tearDown: done => {
        statusStub.reset();
        sendStub.reset();
        done();
    },

    'validateRequiredFields returns nothing and throws nothing if all values are there': test => {
        try {
            test.equal(API.validateRequiredFields({key1: 'v', key2: 'c'}, ['key1','key2']), undefined);
            test.done();
        } catch(err) {
            test.done(err)
        }
    },

    'validateRequiredFields throws an error if a value is not specified': test => {
        try {
            API.validateRequiredFields({key1: 'v'}, ['key1','key2']);
            test.done("should fail");
        } catch(err) {
            test.ok(err instanceof ErrorResponse);
            test.deepEqual(err.getResponse(), {
                status: 400,
                message: "missing required fields",
                code: ErrorResponse.codes.MISSING_VALUES,
                errors: [
                    {
                        field: 'key2',
                        status: ErrorResponse.fieldStatuses.MISSING
                    }
                ]
            });
            test.done()
        }
    },

    'validateRequiredFields throws an error if a value is an empty string': test => {
        try {
            API.validateRequiredFields({key1: '', key2: 'c'}, ['key1','key2']);
            test.done("should fail");
        } catch(err) {
            test.ok(err instanceof ErrorResponse);
            test.deepEqual(err.getResponse(), {
                status: 400,
                message: "missing required fields",
                code: ErrorResponse.codes.MISSING_VALUES,
                errors: [
                    {
                        field: 'key1',
                        status: ErrorResponse.fieldStatuses.MISSING
                    }
                ]
            });
            test.done()
        }
    },

    'validateRequestFields returns nothing and throws nothing if all values are there': test => {
        try {
            test.equal(API.validateRequestFields({email: 'abd@basd.com', type: 'ADMIN', password: 'abcde1'}, ['email','password','type']), undefined);
            test.done();
        } catch(err) {
            console.log(err);
            test.done(err)
        }
    },

    'validateRequestFields throws an error if email is invalid': test => {
        try {
            API.validateRequestFields({email: 'c'}, ['email']);
            test.done("should fail");
        } catch(err) {
            test.ok(err instanceof ErrorResponse);
            test.deepEqual(err.getResponse(), {
                status: 400,
                message: "contains invalid fields",
                code: ErrorResponse.codes.INVALID_VALUES,
                errors: [
                    {
                        field: 'email',
                        status: ErrorResponse.fieldStatuses.INVALID
                    }
                ]
            });
            test.done()
        }
    },

    'validateRequestFields throws an error if password is too short': test => {
        try {
            API.validateRequestFields({password: 'asd'}, ['password']);
            test.done("should fail");
        } catch(err) {
            test.ok(err instanceof ErrorResponse);
            test.deepEqual(err.getResponse(), {
                status: 400,
                message: "contains invalid fields",
                code: ErrorResponse.codes.INVALID_VALUES,
                errors: [
                    {
                        field: 'password',
                        status: ErrorResponse.fieldStatuses.INVALID
                    }
                ]
            });
            test.done()
        }
    },

    'validateRequestFields throws an error if type is not a valid usertype': test => {
        try {
            API.validateRequestFields({type: 'MegaAdmin'}, ['type']);
            test.done("should fail");
        } catch(err) {
            test.ok(err instanceof ErrorResponse);
            test.deepEqual(err.getResponse(), {
                status: 400,
                message: "contains invalid fields",
                code: ErrorResponse.codes.INVALID_VALUES,
                errors: [
                    {
                        field: 'type',
                        status: ErrorResponse.fieldStatuses.INVALID
                    }
                ]
            });
            test.done()
        }
    },

    'processErrorResponse sends the ErrorResponse that was passed in if it is an instance of ErrorResponse': test => {
        API.processErrorResponse(responseStub, new ErrorResponse(345, "message", "code", [{error:'error'}]));
        test.ok(statusStub.calledWith(345));
        test.ok(sendStub.calledWith({
            status: 345,
            message: 'message',
            code: 'code',
            errors: [{error:'error'}]
        }));
        test.done();
    },

    'processErrorResponse sends a generic 500 ErrorResponse if error is not an instance of ErrorResponse': test => {
        API.processErrorResponse(responseStub, "rando error");
        test.ok(statusStub.calledWith(500));
        test.ok(sendStub.calledWith({
            status: 500,
            message: "Something went wrong with your request",
            code: ErrorResponse.codes.SERVER_ERROR,
            errors: undefined
        }));
        test.done();
    }
};