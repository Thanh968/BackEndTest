"use strict"

const discountModel = require("../discount.model");
const {
    notGetFields,
    convertStringToObjectId
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

const findOneDiscountWithQuery = async (query, unselect = []) => {
    const result = await discountModel.findOne(query)
        .select(notGetFields(unselect))
        .lean();
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

const deleteDiscount = async (discount_id) => {
    const deleted_discount = await discountModel.findByIdAndDelete(convertStringToObjectId(discount_id));
    return deleted_discount;
}

const updateOneDiscount = async (id, update) => {
    const result = await discountModel.findByIdAndUpdate(id, update, {new: true});
    return result;
}

module.exports = {
    createNewDiscount,
    checkDiscountExist,
    findOneDiscountWithQuery,
    findAllDiscountWithQuery,
    deleteDiscount,
    updateOneDiscount
}