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
            metadata: await ProductService.findAllDraftProduct({product_shop: req.decodeData.userId, skip: req.params.skip, limit: 50}),
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

    static async findProductByUser(req, res, next) {
        new OkSuccessResponse({
            message: `Products fetched successfully`,
            metadata: await ProductService.findProductByUser(req.params),
        }).send(res);
    }

    static async findAllProducts(req, res, next) {
        new OkSuccessResponse({
            message: `Products fetched successfully`,
            metadata: await ProductService.findAllProducts({
                page: req.params.page,
                select: req.body.select,
            }),
        }).send(res);
    }

    static async findProduct(req, res, next) {
        new OkSuccessResponse({
            message: `Product fetched successfully`,
            metadata: await ProductService.findProduct({
                product_id: req.params.id,
                select: req.body.select,
            }),
        }).send(res);
    }

    static async updateProduct(req, res, next) {
        new OkSuccessResponse({
            message: `Product updated successfully`,
            metadata: await ProductService.updateProduct({
                product_shop: req.decodeData.userId,
                payload: req.body,
            }),
        }).send(res);
    }

    static async deleteProduct(req, res, next) {
        new OkSuccessResponse({
            message: (await ProductService.deleteProduct({
                product_shop: req.decodeData.userId,
                ...req.body,
            })).message,
        }).send(res);
    }
}

module.exports = ProductsController