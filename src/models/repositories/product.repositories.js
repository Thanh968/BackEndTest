"use strict"

const {products} = require(`../products.model`);
const {ConflictErrorResponse} = require(`../../response/error.response`);

const findAllProductsWithQuery = async ({query, limit, skip}) => {
    const result = await products.find(query)
    .populate('product_shop', "name -_id")
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();
    
    return result;
}

const publishAProduct = async ({product_id, product_shop}) => {
    const holderProduct = await products.findOneAndUpdate({
        product_shop: product_shop,
        _id: product_id,
        isDraft: false,
    });

    if (!holderProduct) {
        throw new ConflictErrorResponse({message: `Error: fail to find product`});
    }

    holderProduct.isDraft = false;
    holderProduct.isPublish = true;
    let result = 1;

    try {
        await holderProduct.save();
    } catch (error) {
        result = 0;
    }

    return result;
}

const draftAProduct = async ({product_id, product_shop}) => {
    const holderProduct = await products.findOneAndUpdate({
        product_shop: product_shop,
        _id: product_id,
        isPublish: true,
    });

    if (!holderProduct) {
        throw new ConflictErrorResponse({message: `Error: fail to find product`});
    }

    holderProduct.isDraft = true;
    holderProduct.isPublish = false;

    let result = 1;

    try {
        await holderProduct.save();
    } catch (error) {
        result = 0;
    }

    return result;
}

module.exports = { findAllProductsWithQuery, publishAProduct, draftAProduct };