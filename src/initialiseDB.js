'use strict';

const alasql = require('alasql');
const userModel = require('./model/User');

module.exports = () => {

    alasql("CREATE TABLE users (username STRING, email STRING, password STRING, salt STRING, type STRING)");

    userModel.addUser({username: 'alison', email: 'alison@aol.com', password: 'newPass987', type: userModel.userTypes.ADMIN});
    userModel.addUser({username: 'bernie', email: 'burnie@gmail.com', password: 'p455w0rd', type: userModel.userTypes.CUSTOMER});
    userModel.addUser({username: 'chamaiporn', email: 'c_h@hotmail.com', password: 'qwer1', type: userModel.userTypes.CUSTOMER});
};