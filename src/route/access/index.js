`use strict`
const express = require(`express`);
const route = express.Router();
const AccessController = require(`../../controllers/access.controller`);
const {asyncErrorHandling} = require(`../../helper`);
const { checkAuthentication } = require("../../auth/auth");

route.post(`/shop/signup`,asyncErrorHandling(AccessController.signUp));
route.post(`/shop/login`, asyncErrorHandling(AccessController.login));

route.use(asyncErrorHandling(checkAuthentication));
route.post(`/shop/logout`, asyncErrorHandling(AccessController.LogOut));
route.post(`/shop/handle-refesh-token`, asyncErrorHandling(AccessController.handleRefreshToken));

module.exports = route;