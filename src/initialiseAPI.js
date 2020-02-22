'use strict';

const initialiseDB = require('./initialiseDB');
const services = require('./service/index');
const ErrorResponse = require('./domain/ErrorResponse');
const SuccessResponse = require('./domain/SuccessResponse');
const express = require('express');

const app = express();

process.env.jwtKey = "dtrftg216e7y3u9dh3cn8dqes0qaf4rb6cwe7sdhc";

initialiseDB();

app.use(express.json());

app.post('/signin', (req, res) => {
    try {

        const requestBody = req.body;

        services.API.validateRequiredFields(requestBody, ['username', 'password']);
        // Avoid 404 errors if user doesn't exist to avoid giving out info that the password is specifically wrong.
        // However, hackers will still be able to check if username exists from user creation endpoint
        services.Authorization.verifyUsernameAndPassword(requestBody.username, requestBody.password);

        const jwt = services.Authorization.createAuthToken(requestBody.username);
        const response = new SuccessResponse(200, "successful authentication", {accessToken: jwt});
        res.status(response.status).send(response.getResponse())
    } catch(err) {
        services.API.processErrorResponse(res, err);
    }
});

app.post('/user', (req, res) => {
    try {

        const requestBody = req.body;

        services.API.validateRequiredFields(requestBody, ['username', 'email', 'password']);
        services.API.validateRequestFields(requestBody, ['email', 'password', 'type']);

        if(!requestBody.type){
            requestBody.type = 'CUSTOMER'
        }

        services.User.createUser(requestBody);

        const response = new SuccessResponse(200, "successfully created your user");
        res.status(response.status).send(response.getResponse());

    } catch(err) {
        services.API.processErrorResponse(res, err);
    }
});

app.get('/user/:username', (req, res) => {
    try {
        services.Authorization.verifyJwt(req.headers.authorization, req.params.username);

        const user = services.User.getUser(req.params.username);
        const response = new SuccessResponse(200, "successful user retrieval", user);

        res.status(response.status).send(response.getResponse());
    } catch(err) {
        services.API.processErrorResponse(res, err);
    }
});

app.listen(8080);