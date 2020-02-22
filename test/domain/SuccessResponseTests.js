'use strict';

const SuccessResponse = require('../../src/domain/SuccessResponse');

exports['SuccessResponse Tests'] = {

    'SuccessResponse constructor sets values appropriately': test => {

        const successResponse = new SuccessResponse(200, "Success Request", {key: "value"});

        test.equal(successResponse.status, 200);
        test.equal(successResponse.message, "Success Request");
        test.deepEqual(successResponse.payload, {key: "value"});
        test.done();

    },

    'SuccessResponse setters set values appropriately': test => {

        const successResponse = new SuccessResponse();

        successResponse.setStatus(200);
        successResponse.setMessage("Success Request");
        successResponse.setPayload({key:"value"});

        test.equal(successResponse.status, 200);
        test.equal(successResponse.message, "Success Request");
        test.deepEqual(successResponse.payload, {key:"value"});
        test.done();

    },

    'SuccessResponse getResponse returns an object with the error response fields': test => {

        const successResponse = new SuccessResponse(200, "Success Request", {key:"value"});

        test.deepEqual(successResponse.getResponse(), {
            status: 200,
            message: "Success Request",
            payload: {key:"value"}
        });

        test.done();
    }

};
