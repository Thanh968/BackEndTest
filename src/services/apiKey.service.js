'use strict'
const apiKeyModel = require('../models/apiKey.model');
const { ConflictErrorResponse } = require('../response/error.response');

class ApiKeyService {
    static createNewApiKey = async ({key, status, permissions}) => {
        const holderApiKey = await apiKeyModel.findOne({key: key}).lean();

        if (holderApiKey) {
            throw new ConflictErrorResponse({message: 'Api key has been created'});
        }

        const newApiKey = await apiKeyModel.create({
            key: key,
            status: status,
            permissions: permissions,
        });

        return newApiKey;
    }

    static findApiKeyByKey = async (apiKey) => {
        const holderApiKey = await apiKeyModel.findOne({key: apiKey}).lean();
        return holderApiKey;
    }
}

module.exports = ApiKeyService;