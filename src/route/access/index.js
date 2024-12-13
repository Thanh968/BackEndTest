`use strict`
const express = require(`express`);
const route = express.Router();
const AccessController = require(`../../controllers/access.controller`);
const {asyncErrorHandling} = require(`../../helper`);
const { checkAuthentication } = require("../../auth/auth");

route.post(`/shop/signup`,asyncErrorHandling(AccessController.signUp));
route.post(`/shop/login`, asyncErrorHandling(AccessController.login));

route.use(asyncErrorHandling(checkAuthentication));
route.get(`/shop/example`, (req, res, next) => {
    return res.status(200).json({
        message: "Hello client",
    });
});

module.exports = route;