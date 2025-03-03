"use strict"
const deletedDiscountModel = require("../deletedDiscount.model");

const insertDeletedDiscount = async (discount_payload) => {
    const deletedDiscount = await deletedDiscountModel.create(discount_payload);
    return deletedDiscount;
}

module.exports = {
    insertDeletedDiscount
}