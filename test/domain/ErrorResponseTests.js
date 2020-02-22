'use strict';

const ErrorResponse = require('../../src/domain/ErrorResponse');

exports['ErrorResponse Tests'] = {

    'ErrorResponse constructor sets values appropriately': test => {

        const errorResponse = new ErrorResponse(400, "Bad Request", "BAD_STUFF", [{field:"error"}]);

        test.equal(errorResponse.status, 400);
        test.equal(errorResponse.message, "Bad Request");
        test.equal(errorResponse.code, "BAD_STUFF");
        test.deepEqual(errorResponse.errors, [{field:"error"}]);
        test.done();

    },

    'ErrorResponse setters set values appropriately': test => {

        const errorResponse = new ErrorResponse();

        errorResponse.setStatus(400);
        errorResponse.setMessage("Bad Request");
        errorResponse.setCode("BAD_STUFF");
        errorResponse.setErrors([{field:"error"}]);

        test.equal(errorResponse.status, 400);
        test.equal(errorResponse.message, "Bad Request");
        test.equal(errorResponse.code, "BAD_STUFF");
        test.deepEqual(errorResponse.errors, [{field:"error"}]);
        test.done();

    },

    'ErrorResponse addError creates a new array if one is not already set': test => {

        const errorResponse = new ErrorResponse();

        errorResponse.addError({field:"error"});

        test.deepEqual(errorResponse.errors, [{field:"error"}]);
        test.done();
    },

    'ErrorResponse codes returns an object of codes': test => {
        test.deepEqual(ErrorResponse.codes, {
            MISSING_VALUES: "MISSING_VALUES",
            INVALID_VALUES: "INVALID_VALUES",
            DUPLICATE_VALUES: "DUPLICATE_VALUES",
            SERVER_ERROR: "SERVER_ERROR",
            INVALID_LOGIN: "INVALID_LOGIN",
            UNAUTHORIZED: "UNAUTHORIZED",
            FORBIDDEN: "FORBIDDEN",
            NOT_FOUND: "NOT_FOUND"
        });
        test.done();
    },

    'ErrorResponse fieldStatuses returns an object of statuses': test => {
        test.deepEqual(ErrorResponse.fieldStatuses, {
            INVALID: "INVALID",
            DUPLICATE: "DUPLICATE",
            MISSING: "MISSING"
        });
        test.done();
    },

    'ErrorResponse getResponse returns an object with the error response fields': test => {

        const errorResponse = new ErrorResponse(400, "Bad Request", "BAD_STUFF", [{field:"error"}]);

        test.deepEqual(errorResponse.getResponse(), {
            status: 400,
            message: "Bad Request",
            code: "BAD_STUFF",
            errors: [{field:"error"}]
        });

        test.done();
    }

};