"use strict"
const {
    convertStringToObjectId,
    convertStringToDate
} = require("../ultils");
const {BadRequestErrorResponse} = require("../response/error.response");
const {
    createNewDiscount,
} = require("../models/repositories/discount.repo");
const DiscountValidator = require('../validators/discount.validator');

class DiscountService {
    static async createDiscount(payload) {
        await DiscountValidator.validateCreatePayload(payload);

        payload.discount_shop_id = convertStringToObjectId(payload.discount_shop_id);
        payload.discount_start_date = convertStringToDate(payload.discount_start_date);
        payload.discount_end_date = convertStringToDate(payload.discount_end_date);

        const new_discount = await createNewDiscount(payload);

        return new_discount;
    }

    
}

module.exports = DiscountService