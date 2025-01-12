"use strict"

const express = require(`express`);
const router = express.Router();
const ProductsController = require(`../../controllers/products.controller`);
const {asyncErrorHandling} = require(`../../helper`);
const {checkAuthentication} = require(`../../auth/auth`);

router.use(asyncErrorHandling(checkAuthentication));
router.post(`/create-product`, asyncErrorHandling(ProductsController.createProduct));
router.get(`/draft/all/:skip`, asyncErrorHandling(ProductsController.findAllDraftProducts));
router.get(`/publish/all/:skip`, asyncErrorHandling(ProductsController.findAllPublishProducts));
router.post(`/publish/:product_id`, asyncErrorHandling(ProductsController.publishAProduct));
router.post(`/draft/:product_id`, asyncErrorHandling(ProductsController.draftAProduct));   

module.exports = router;