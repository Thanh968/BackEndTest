`use strict`
const {CreatedSuccessResponse} = require(`../response/success.response`);
const AccessService = require(`../services/access.service`);

class AccessController {
    static async signUp(req, res, next) {
        new CreatedSuccessResponse({
            message: 'New shop created',
            metadata: await AccessService.signUp(req.body),
        }).send(res);
    }
}

module.exports = AccessController;