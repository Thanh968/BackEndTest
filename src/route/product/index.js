"use strict"

const express = require(`express`);
const router = express.Router();
const ProductsController = require(`../../controllers/products.controller`);
const {asyncErrorHandling} = require(`../../helper`);
const {checkAuthentication} = require(`../../auth/auth`);

router.use(asyncErrorHandling(checkAuthentication));
router.post(`/create-product`, asyncErrorHandling(ProductsController.createProduct));

module.exports = router;