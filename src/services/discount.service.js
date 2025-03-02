"use strict"
const {
    convertStringToObjectId,
    convertStringToDate
} = require("../ultils");
const {BadRequestErrorResponse} = require("../response/error.response");
const {
    createNewDiscount,
    findOneDiscountWithQuery,
    findAllDiscountWithQuery
} = require("../models/repositories/discount.repo");
const DiscountValidator = require('../validators/discount.validator');
const {
    findAllProductsWithQuery
} = require("../models/repositories/product.repositories");

class DiscountService {
    static async createDiscount(payload) {
        await DiscountValidator.validateCreatePayload(payload);

        payload.discount_shop_id = convertStringToObjectId(payload.discount_shop_id);
        payload.discount_start_date = convertStringToDate(payload.discount_start_date);
        payload.discount_end_date = convertStringToDate(payload.discount_end_date);

        const new_discount = await createNewDiscount(payload);

        return new_discount;
    }

    static async findAllProductAppliedByThisDiscount(payload) {
        DiscountValidator.validateAppliedDiscountPayload(payload);
        const found_discount = await findOneDiscountWithQuery({
            discount_shop_id: convertStringToObjectId(payload.discount_shop_id),
            discount_code: payload.discount_code,
            discount_is_active: true
        });

        if (!found_discount) {
            throw new BadRequestErrorResponse({message: `Error: this discount code is not exist`});
        }

        DiscountValidator.validateDateOfUseForDiscount(found_discount.discount_start_date, found_discount.discount_end_date);

        const query = {
            product_shop: convertStringToObjectId(payload.discount_shop_id),
            isPublish: true,
            limit: payload.limit,
            skip: payload.page - 1
        };

        if (found_discount.discount_applies_to === "specific") {
            query[_id] = {$in: found_discount.discount_product_ids};
        }

        const product_array = await findAllProductsWithQuery(query);

        return product_array;
    }

    static async getAllDiscountOfShop(payload) {
        DiscountValidator.validatePayloadGetAllDiscountOfShop(payload);
        const current_date = new Date();
        const query = {
            discount_shop_id: convertStringToObjectId(payload.shop_id),
            discount_is_active: true,
            discount_start_date: {$lte: current_date},
            discount_end_date: {$gte: current_date}
        };
        const unselect = ['__v', 'discount_shop_id'];
        const {limit, page} = payload;
        const foundDiscounts = await findAllDiscountWithQuery(query, limit, page, unselect);
        return foundDiscounts;
    }
}

module.exports = DiscountService