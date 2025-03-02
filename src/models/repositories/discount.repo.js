"use strict"

const discountModel = require("../discount.model");
const {
    notGetFields
} = require('../../ultils');

const createNewDiscount = async (payload) => {
    const result = await discountModel.create(payload);
    return result;
}

const checkDiscountExist = async (discount_shop_id, discount_code) => {
    const found_discount = await discountModel.findOne({
        discount_shop_id: discount_shop_id,
        discount_code: discount_code
    });
    const result = (found_discount !== null);
    return result;
}

const findOneDiscountWithQuery = async (query) => {
    const result = await discountModel.findOne(query).lean();
    return result;
}

const findAllDiscountWithQuery = async (query, limit, page, unselect = []) => {
    const result = await discountModel.find(query)
        .limit(limit)
        .skip(page - 1)
        .select(notGetFields(unselect))
        .lean();
    return result;
}

module.exports = {
    createNewDiscount,
    checkDiscountExist,
    findOneDiscountWithQuery,
    findAllDiscountWithQuery
}