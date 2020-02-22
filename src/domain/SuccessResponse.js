'use strict';

/**
 *  Standard API Response object to unify what all API responses should look like
 *  Should be used for successful (2xx) responses
 */
class SuccessResponse {

    constructor(status, message, payload) {
        this.status = status;
        this.message = message;
        this.payload = payload;
    }

    setStatus(status) {
        this.status = status;
    }

    setMessage(message) {
        this.message = message;
    }

    setPayload(payload) {
        this.payload = payload;
    }

    /**
     * To be used in the controller as part of res.send
     *
     * @returns {{status: *, message: *, payload: *}} the response payload
     */
    getResponse(){
        return {
            status: this.status,
            message: this.message,
            payload: this.payload
        }
    }

}

module.exports = SuccessResponse;