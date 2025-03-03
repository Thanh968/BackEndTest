"use strict"

const express = require("express");
const route = express.Router();
const {checkAuthentication} = require("../../auth/auth");
const {asyncErrorHandling} = require("../../helper");
const discountController = require("../../controllers/discount.controller");
const DiscountController = require("../../controllers/discount.controller");

route.use(asyncErrorHandling(checkAuthentication));

route.post("/", asyncErrorHandling(discountController.createNewDiscount));
route.get("/discount-amount", asyncErrorHandling(DiscountController.getDiscountMoney));
route.delete('/', asyncErrorHandling(discountController.deleteDiscount));

module.exports = route;