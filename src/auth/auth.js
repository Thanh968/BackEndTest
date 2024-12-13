'use strict'

const {UnauthorizedErrorResponse, BadRequestErrorResponse} = require('../response/error.response');
const apiKeyService = require('../services/apiKey.service');
const JWT = require(`jsonwebtoken`);
const KeyTokenService = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    USER_ID: 'x-user-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'refresh-token',
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

const checkAuthentication = async (req, res, next) => {
    const userId = req.headers[HEADER.USER_ID];

    if (!userId) {
        throw new BadRequestErrorResponse({message: `User id is missing`});
    }

    const keyTokenForUser = await KeyTokenService.findKeyByUserId(userId);

    if (!keyTokenForUser) {
        throw new UnauthorizedErrorResponse({message: "User is not exist"});
    }

    if (req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
            const decodeData = verifyToken(refreshToken, keyTokenForUser.privateKey);

            if (userId !== decodeData.userId) {
                throw new UnauthorizedErrorResponse({message: `user id not match`});
            }

            req.keyTokens = keyTokenForUser;
            req.decodeData = decodeData;

            return next();
        } catch (error){
            throw new UnauthorizedErrorResponse({message: error.message});
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];

    if (!accessToken) {
        throw new BadRequestErrorResponse({message: `require info missing`});
    }

    try {
        const decodeData = verifyToken(accessToken, keyTokenForUser.publicKey);

        if (userId !== decodeData.userId) {
            throw new UnauthorizedErrorResponse({message: `User id not match`});
        }

        req.keyTokens = keyTokenForUser;
        req.decodeData = decodeData;

        return next();
    } catch (error) {
        throw new UnauthorizedErrorResponse({message: error.message});
    }
}

module.exports = {
    checkApiKey,
    checkPermission,
    createTokenPair,
    verifyToken,
    checkAuthentication,
};