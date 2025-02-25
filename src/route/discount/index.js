"use strict"

const express = require("express");
const route = express.Router();
const {checkAuthentication} = require("../../auth/auth");
const {asyncErrorHandling} = require("../../helper");
const discountController = require("../../controllers/discount.controller");

route.use(asyncErrorHandling(checkAuthentication));

route.post("/", asyncErrorHandling(discountController.createNewDiscount));

module.exports = route;