'use strict'
const keyTokenModel = require(`../models/keyToken.model`);

class KeyTokenService {
    static async saveKeyToken({userId, publicKey, privateKey, refreshedToken}) {
        const filter = {userId: userId};
        const update = {publicKey: publicKey, privateKey: privateKey, refreshedToken: refreshedToken};
        const newKey = await keyTokenModel.findOneAndUpdate(filter, {$set: update}, {upsert: true, new: true});
        return newKey;
    }

    static async findKeyByUserId(userId) {
        const holderKey = await keyTokenModel.findOne({userId: userId}).lean();
        return holderKey;
    }
}

module.exports = KeyTokenService;