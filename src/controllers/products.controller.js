"use strict"
const {OkSuccessResponse} = require(`../response/success.response`);
const ProductService = require(`../services/product.service`);

class ProductsController {
    static async createProduct(req, res, next) {
        new OkSuccessResponse({
            message: `Product created successfully`,
            metadata: await ProductService.createProduct(req.body),
        }).send(res);
    }
}

module.exports = ProductsController