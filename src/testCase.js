const {expect} = require('expect');
const mongoose = require("mongoose");
const request = require("supertest");
const express = require('express');
const app = express();

require('./app/Libraries/Dotenv');
require('./app/Libraries/ConnectMongo');
require('./app/Libraries/I18n').useByApp(app);
require('./app/Libraries/Session').useByApp(app);
require('./app/Libraries/Passport').useByApp(app);
const utils = require("./utils/helpers");
const {redis_flush} = require("./utils/helpers");

app.use(express.urlencoded({extended: false}));
app.use(express.json());

module.exports.app = app;
module.exports.expect = expect;
module.exports.mongoose = mongoose;
module.exports.request = request;
module.exports.utils = utils;
module.exports.redis_flush = async () => {
    await redis_flush();
};

