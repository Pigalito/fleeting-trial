'use strict';

/**
 *  Standard API Response object to unify what all API responses should look like
 *  Should be used for unsuccessful (4xx,5xx) responses
 */
class ErrorResponse {

    constructor(status, message, code, errors) {
        this.status = status;
        this.message = message;
        this.code = code;
        this.errors = errors;
    }

    setStatus(status) {
        this.status = status;
    }

    setMessage(message) {
        this.message = message;
    }

    setCode(code) {
        this.code = code;
    }

    setErrors(errors) {
        this.errors = errors;
    }

    addError(error) {
        if(!this.errors) {
            this.errors = [];
        }

        this.errors.push(error);
    }

    static get codes(){
        return {
            MISSING_VALUES: "MISSING_VALUES", // user is missing required parameters from their request
            INVALID_VALUES: "INVALID_VALUES", // user is making a request with invalid values, e.g. invalid email address
            DUPLICATE_VALUES: "DUPLICATE_VALUES", // user is trying to create a resource with values that already exist
            SERVER_ERROR: "SERVER_ERROR", // catch all term for something wrong on our end
            INVALID_LOGIN: "INVALID_LOGIN", // Login details provided by the user are incorrect
            UNAUTHORIZED: "UNAUTHORIZED", // user trying to get access without a valid token
            FORBIDDEN: "FORBIDDEN", // user trying to get access to a resource they don't have access to
            NOT_FOUND: "NOT_FOUND" //user try to access a resource that doesn't exist
        }
    }

    static get fieldStatuses(){
        return {
            INVALID: "INVALID", // value supplied in this field is invalid
            DUPLICATE: "DUPLICATE", // value supplied in this field is a duplicate of an already existing resource
            MISSING: "MISSING" // required value not supplied in the request
        }
    }

    /**
     * Used to get a friendly object that can be returned in the res.send function
     *
     * @returns {{status: *, message: *, code: *, errors: (*|Array)}}
     */
    getResponse(){
        return {
            status: this.status,
            message: this.message,
            code: this.code,
            errors: this.errors
        }
    }

}

module.exports = ErrorResponse;