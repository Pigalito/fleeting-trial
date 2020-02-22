'use strict';

/**
 * This file contains functions for processing API requests and responses and ensuring validity of them
 */

const userModel = require('../model/User');
const ErrorResponse = require('../domain/ErrorResponse');

const fieldRegexes = {
    email: /(.+)@(.+){2,}\.(.+){2,}/,
    password: /^(?=.*\d).{4,14}$/,
    type: new RegExp(`^(${Object.values(userModel.userTypes).join('|')})$`)
};

/**
 * Verifies that the input object contains values for all the fields specified in the input array
 *
 * @param body      Object to be verified
 * @param fields    List of fields to check the object has
 */
function validateRequiredFields(body, fields) {
    const errorResponse = new ErrorResponse(400, "missing required fields", ErrorResponse.codes.MISSING_VALUES, []);

    fields.forEach(field => {
        if(body[field] === undefined || body[field] === "") {
            errorResponse.addError({
                field: field,
                status: ErrorResponse.fieldStatuses.MISSING
            })
        }
    });

    if(errorResponse.errors.length > 0) {
        throw errorResponse;
    }
}

/**
 * Verifies that all the fields in the input object, that are specified in the fields array input, are valid values
 * based on regex stored in this file.
 *
 * @param body      Object to verify
 * @param fields    List of fields to check the object's validity for
 */
function validateRequestFields(body, fields) {
    const errorResponse = new ErrorResponse(400, "contains invalid fields", ErrorResponse.codes.INVALID_VALUES, []);

    fields.forEach(field => {
        if(body[field] && fieldRegexes[field]
            && !fieldRegexes[field].test(body[field])) {
            errorResponse.addError({
                field: field,
                status: ErrorResponse.fieldStatuses.INVALID
            })
        }
    });

    if(errorResponse.errors.length > 0) {
        throw errorResponse;
    }
}

/**
 * Function to be used by all calls when they have any error and need to send it back to original requester
 *
 * @param res   response object provided by express
 * @param err   error that has been thrown
 */
function processErrorResponse(res, err) {
    console.error(err);
    if(err instanceof ErrorResponse){
        res.status(err.status).send(err.getResponse())
    } else {
        res.status(500).send(new ErrorResponse(500, "Something went wrong with your request", ErrorResponse.codes.SERVER_ERROR).getResponse())
    }
}



module.exports = {
    validateRequiredFields,
    validateRequestFields,
    processErrorResponse
};