const express = require('express');
const {asyncErrorHandling} = require('../helper');
const {checkApiKey, checkPermission} = require('../auth/auth');
const route = express.Router();

route.use(asyncErrorHandling(checkApiKey));
route.use(asyncErrorHandling(checkPermission("0001")));

route.get('/', (req, res, next) => {
    return res.status(200).json({
        message: "Hello Client",
    })
});

module.exports = route;