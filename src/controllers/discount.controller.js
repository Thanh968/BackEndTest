"use strict"

const discountService = require("../services/discount.service");
const { CreatedSuccessResponse, OkSuccessResponse} = require("../response/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
    static createNewDiscount = async (req, res, next) => {
        req.body.discount_shop_id = req.decodeData.userId
        new CreatedSuccessResponse({
            message: "Create new discount success",
            metadata: await discountService.createDiscount(req.body)
        }).send(res);
    }

    static getAllProductsAppliedByDiscount = async (req, res, next) => {
        new OkSuccessResponse({
            message: "Get all products apllied by discount success",
            metadata: await discountService.findAllProductAppliedByThisDiscount(req.body)
        }).send(res);
    }

    static getAllDiscountOfShop = async (req, res, next) => {
        const payload = {
            shop_id: req.query['shop_id'],
            page: req.query['page'],
            limit: 50
        };
        new OkSuccessResponse({
            message: "Get all discount of shop",
            metadata: await DiscountService.getAllDiscountOfShop(payload)
        }).send(res);
    }

    static getDiscountMoney = async(req, res, next) => {
        const payload = {
            discount_code: req.body['discount_code'],
            discount_shop_id: req.body['discount_shop_id'],
            user_id: req.decodeData.userId,
            products: req.body['products']
        };
        new OkSuccessResponse({
            message: "Get amount of discounted money success",
            metadata: await DiscountService.getDiscountAmount(payload)
        }).send(res);
    }
}

module.exports = DiscountController;