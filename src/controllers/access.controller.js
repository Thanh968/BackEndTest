`use strict`
const {CreatedSuccessResponse, OkSuccessResponse} = require(`../response/success.response`);
const AccessService = require(`../services/access.service`);

class AccessController {
    static async signUp(req, res, next) {
        new CreatedSuccessResponse({
            message: 'New shop created',
            metadata: await AccessService.signUp(req.body),
        }).send(res);
    }

    static async login(req, res, next) {
        new OkSuccessResponse({
            message: "Login success",
            metadata: await AccessService.logIn(req.body),
        }).send(res);
    }

    static async LogOut(req, res, next) {
        new OkSuccessResponse({
            message: "log out success",
            metadata: (await AccessService.logOut(req.decodeData.userId)).message,
        }).send(res);
    }

    static async handleRefreshToken(req, res, next) {
        new OkSuccessResponse({
            message: `Handlle refresh token success`,
            metadata: await AccessService.handleRefreshToken({refreshToken: req.headers['refresh-token'], decodeData: req.decodeData, keyToken: req.keyTokens}),
        }).send(res);
    }
}

module.exports = AccessController;