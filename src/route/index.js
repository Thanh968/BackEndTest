const express = require('express');
const {asyncErrorHandling} = require('../helper');
const {checkApiKey, checkPermission} = require('../auth/auth');
const route = express.Router();
const ProductController = require(`../controllers/products.controller`);
const DiscountController = require("../controllers/discount.controller");

route.get('/api/v1/', asyncErrorHandling(ProductController.findAllProducts));
route.get('/api/v1/:id', asyncErrorHandling(ProductController.findProduct));
route.get('/api/v1/products/:keySearch', asyncErrorHandling(ProductController.findProductByUser));
route.get('/api/v1/discounts/products', asyncErrorHandling(DiscountController.getAllProductsAppliedByDiscount));

route.use(asyncErrorHandling(checkApiKey));
route.use(asyncErrorHandling(checkPermission("0001")));

route.use('/api/v1/access', require('./access'));
route.use('/api/v1/products', require('./product'));
route.use('/api/v1/discounts', require("./discount"));

module.exports = route;