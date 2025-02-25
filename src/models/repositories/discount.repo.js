"use strict"

const discountModel = require("../discount.model");

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

module.exports = {
    createNewDiscount,
    checkDiscountExist
}