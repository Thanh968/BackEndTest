'use strict'
const keyTokenModel = require(`../models/keyToken.model`);
const { InternalServerErrorResponse } = require("../response/error.response");

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

    static async deleteKeyToken(userId) {
        const key = await keyTokenModel.deleteOne({userId: userId});
        return key;
    }

    static async updateRefreshToken({usedRefreshToken, newRefeshToken, userId}) {
        const condition = {userId: userId};
        const update = {
            $set: {refreshedToken: newRefeshToken},
            $push: {usedRefreshedToken: usedRefreshToken}
        };
        await keyTokenModel.findOneAndUpdate(condition,update)
        .then(_ => console.log('Cap nhat thanh cong'))
        .catch(err => {throw new InternalServerErrorResponse({message: `Update fail please try again later`})});
    }
}

module.exports = KeyTokenService;