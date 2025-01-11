const express = require('express');
const {asyncErrorHandling} = require('../helper');
const {checkApiKey, checkPermission} = require('../auth/auth');
const route = express.Router();

route.use(asyncErrorHandling(checkApiKey));
route.use(asyncErrorHandling(checkPermission("0001")));
route.use('/api/v1/access', require('./access'));
route.use('/api/v1/products', require('./product'));

module.exports = route;