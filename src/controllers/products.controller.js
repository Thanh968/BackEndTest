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

    static async findAllDraftProducts(req, res, next) {
        new OkSuccessResponse({
            message: `Draft products fetched successfully`,
            metadata: await ProductService.findAllDraftProduct({product_shop: req.decodeData.userId, skip: req.params.skip}),
        }).send(res);
    }

    static async findAllPublishProducts(req, res, next) {
        new OkSuccessResponse({
            message: `Publish products fetched successfully`,
            metadata: await ProductService.findAllPublishedProduct({product_shop: req.decodeData.userId, skip: req.params.skip}),
        }).send(res);
    }

    static async publishAProduct(req, res, next) {
        new OkSuccessResponse({
            message: `Product published successfully`,
            metadata: await ProductService.publishAProduct({product_id: req.params.product_id, product_shop: req.decodeData.userId}),
        }).send(res);
    }

    static async draftAProduct(req, res, next) {
        new OkSuccessResponse({
            message: `Product drafted successfully`,
            metadata: await ProductService.draftAProduct({product_id: req.params.product_id, product_shop: req.decodeData.userId}),
        }).send(res);
    }
}

module.exports = ProductsController