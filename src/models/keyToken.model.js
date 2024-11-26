'use strict'

const {model, Schema} = require(`mongoose`);

const DOCUMENT_NAME = 'KeyToken';
const COLLECTION_NAME = 'KeyTokens';

const keyTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
        unique: true,
    },
    publicKey: {
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
    },
    refreshedToken: {
        type: String,
        required: true,
    },
    usedRefreshedToken: {
        type: Array,
        default: [],
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

module.exports = model(DOCUMENT_NAME, keyTokenSchema);