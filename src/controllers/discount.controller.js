"use strict"

const discountService = require("../services/discount.service");
const { CreatedSuccessResponse} = require("../response/success.response");

class DiscountController {
    static createNewDiscount = async (req, res, next) => {
        req.body.discount_shop_id = req.decodeData.userId
        new CreatedSuccessResponse({
            message: "Create new discount success",
            metadata: await discountService.createDiscount(req.body)
        }).send(res);
    }
}

module.exports = DiscountController;