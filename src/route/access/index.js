`use strict`
const express = require(`express`);
const route = express.Router();
const AccessController = require(`../../controllers/access.controller`);
const {asyncErrorHandling} = require(`../../helper`)

route.post(`/shop/signup`,asyncErrorHandling(AccessController.signUp));
route.post(`/shop/login`, asyncErrorHandling(AccessController.login));

module.exports = route;