`use strict`
const shopService = require(`./shop.service`);
const KeyTokenService = require(`./keyToken.service`);
const {ConflictErrorResponse, InternalServerErrorResponse, UnauthorizedErrorResponse} = require(`../response/error.response`);
const crypto = require(`crypto`);
const { createTokenPair } = require("../auth/auth");
const { getDataField } = require("../ultils");
const bcrypt = require(`bcrypt`);

class AccessService {
    static async logOut(userId) {
        const holderKey = await KeyTokenService.findKeyByUserId(userId);

        if (!holderKey) {
            throw new ConflictErrorResponse({message: `user id is not exist`});
        }

        const key = await KeyTokenService.deleteKeyToken(userId);

        return {message: "log out success"};
    } 

    static async logIn({email, password}) {
        const holderShop = await shopService.findShopByEmail(email);

        if (!holderShop) {
            throw new UnauthorizedErrorResponse({message: "This email has not been registed"});
        }

        const isMatchPassword = await bcrypt.compare(password, holderShop.password);

        if (!isMatchPassword) {
            throw new UnauthorizedErrorResponse({message: "Invalid password"});
        }

        const publicKey = crypto.randomBytes(64).toString('hex');
        const privateKey = crypto.randomBytes(64).toString('hex');
        const payload = {email: email, userId: holderShop._id};

        const tokens = createTokenPair(payload,publicKey, privateKey);

        await KeyTokenService.saveKeyToken({userId: holderShop._id, publicKey: publicKey, privateKey: privateKey, refreshedToken: tokens.refreshedToken});

        return {
            tokens,
            metadata: getDataField(holderShop, ['_id', 'email', 'name']),
        };
    }

    static async signUp({email, name, password}) {
        const holderShop = await shopService.findShopByEmail(email);

        if (holderShop) {
            throw new ConflictErrorResponse({message: "This email already registed"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newShop = await shopService.createNewShop({email: email, name: name, password: hashedPassword});

        if (!newShop) {
            throw new InternalServerErrorResponse({message: `Unable to create a new shop. Please try again later.`});
        }

        const publicKey = crypto.randomBytes(64).toString('hex');
        const privateKey = crypto.randomBytes(64).toString('hex');
        const payload = {userId: newShop._id, email: newShop.email};

        const tokens = createTokenPair(payload, publicKey, privateKey);
        await KeyTokenService.saveKeyToken({userId: newShop._id, privateKey: privateKey, publicKey: publicKey, refreshedToken: tokens.refreshedToken});

        return {
            accessToken: tokens.accessToken,
            refreshedToken: tokens.refreshedToken,
            metadata: getDataField(newShop, ['_id', 'name', 'email']),
        };
    }
}

module.exports = AccessService;