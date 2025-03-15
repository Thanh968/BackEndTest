"use strict"

const express = require(`express`);
const router = express.Router();
const ProductsController = require(`../../controllers/products.controller`);
const {asyncErrorHandling} = require(`../../helper`);
const {checkAuthentication} = require(`../../auth/auth`);

router.use(asyncErrorHandling(checkAuthentication));
router.post(`/`, asyncErrorHandling(ProductsController.createProduct));
router.patch(`/`, asyncErrorHandling(ProductsController.updateProduct));
router.get(`/draft/all/:skip`, asyncErrorHandling(ProductsController.findAllDraftProducts));
router.get(`/published/all/:skip`, asyncErrorHandling(ProductsController.findAllPublishProducts));
router.post(`/publish/:product_id`, asyncErrorHandling(ProductsController.publishAProduct));
router.post(`/draft/:product_id`, asyncErrorHandling(ProductsController.draftAProduct));
router.delete(`/delete`, asyncErrorHandling(ProductsController.deleteProduct));  

module.exports = router;