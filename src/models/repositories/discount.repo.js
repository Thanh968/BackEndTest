"use strict"

const discountModel = require("../discount.model");

const createNewDiscount = async (payload) => {
    const result = await discountModel.create(payload);
    return result;
}

module.exports = {
    createNewDiscount
}