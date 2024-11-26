'use strict'

const {UnauthorizedErrorResponse} = require('../response/error.response');
const apiKeyService = require('../services/apiKey.service');
const JWT = require(`jsonwebtoken`);

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

const createTokenPair = (payload, publicKey, privateKey) => {
    const accessToken = JWT.sign(payload, publicKey, {
        expiresIn: '1h'
    });
    const refreshedToken = JWT.sign(payload, privateKey, {
        expiresIn: '5h',
    });
    return {accessToken, refreshedToken};
}

const verifyToken = (token, publicKey) => {
    const payload = JWT.verify(token, publicKey);
    return payload;
}

module.exports = {
    checkApiKey,
    checkPermission,
    createTokenPair,
    verifyToken,
};