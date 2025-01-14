const express = require('express');
const {asyncErrorHandling} = require('../helper');
const {checkApiKey, checkPermission} = require('../auth/auth');
const route = express.Router();
const ProductController = require(`../controllers/products.controller`);

route.use(asyncErrorHandling(checkApiKey));
route.use(asyncErrorHandling(checkPermission("0001")));
route.get('/api/v1/', asyncErrorHandling(ProductController.findAllProducts));
route.get('/api/v1/:id', asyncErrorHandling(ProductController.findProduct));
route.get('/api/v1/search/:keySearch', asyncErrorHandling(ProductController.findProductByUser));
route.use('/api/v1/access', require('./access'));
route.use('/api/v1/products', require('./product'));

module.exports = route;