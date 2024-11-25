'use strict'
const {model, Schema} = require('mongoose');

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME ='ApiKeys';

const apiKeySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    permissions: {
        type: [String],
        default: [],
        enum: ["0001", "0002", "0003"],
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

module.exports = model(DOCUMENT_NAME, apiKeySchema);