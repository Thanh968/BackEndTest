"use strict"

const {products} = require(`../products.model`);

const findAllProductsWithQuery = async ({query, limit, skip}) => {
    const result = await products.find(query)
    .populate('product_shop', "name -_id")
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();
    
    return result;
}

module.exports = { findAllProductsWithQuery };