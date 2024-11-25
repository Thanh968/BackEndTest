'use strict'

const {UnauthorizedErrorResponse} = require('../response/error.response');
const apiKeyService = require('../services/apiKey.service');

const HEADER = {
    API_KEY: 'x-api-key',
};

const checkApiKey = async (req, res, next) => {
    const apiKey = req.headers[HEADER.API_KEY];

    if (!apiKey) {
        throw new UnauthorizedErrorResponse({message: 'Api Key Missing'});
    }

    const holderApiKey = await apiKeyService.findApiKeyByKey(apiKey);

    if (!holderApiKey) {
        throw new UnauthorizedErrorResponse({message: `Api key not exist`});
    }
    req.apiKeyObj = holderApiKey;

    return next();
}

const checkPermission = (permission) => {
    return (req, res, next) => {
        console.log(req.apiKeyObj);
        if (!req.apiKeyObj.permissions) {
            throw new UnauthorizedErrorResponse({message: `permission not found`});
        }

        const isPermissionIncluded = req.apiKeyObj.permissions.includes(permission);

        if (!isPermissionIncluded) {
            throw new UnauthorizedErrorResponse({message: `Permission denied`});
        }

        return next();
    }
} 

module.exports = {
    checkApiKey,
    checkPermission
};