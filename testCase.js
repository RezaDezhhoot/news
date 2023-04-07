const {expect} = require('expect');
const mongoose = require("mongoose");
const request = require("supertest");
const express = require('express');
const app = express();

require('./app/Libraries/Dotenv');
require('./app/Libraries/ConnectMongo');
const utils = require("./utils/helpers");

app.use(express.urlencoded({extended: false}));
app.use(express.json());

module.exports.app = app;
module.exports.expect = expect;
module.exports.mongoose = mongoose;
module.exports.request = request;
module.exports.utils = utils;