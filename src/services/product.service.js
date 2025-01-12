'use strict'

const {products, clothes, electronics, furnitures} = require('../models/products.model');
const {ConflictErrorResponse} = require(`../response/error.response`);
const {findAllProductsWithQuery, publishAProduct, draftAProduct, findProductByUser} = require(`../models/repositories/product.repositories`);

class Product {
    constructor({
        product_name, product_description, product_thumb, product_type, product_price, product_quantity,
        product_shop, product_attributes,
    }) {
        this.product_name = product_name;
        this.product_description = product_description;
        this.product_thumb = product_thumb;
        this.product_type = product_type;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    async createProduct() {
        const newProduct = await products.create(this);
        return newProduct;
    }
}

class Clothes extends Product {
    async createProduct() {
        const newClothesAttribute = await clothes.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });

        if (!newClothesAttribute) {
            throw new ConflictErrorResponse({message: `Error: fail to create new clothes attribute`});
        }

        const newProduct = await products.create({
            ...this,
            _id: newClothesAttribute._id
        });

        if (!newProduct) {
            const deletedDoc = await clothes.findByIdAndDelete(newClothesAttribute._id);

            if (!deletedDoc) {
                throw new ConflictErrorResponse({message: `Error: fail to create new clothes product and delete created attributes`});
            } 

            throw new ConflictErrorResponse({message: `Error: fail to create new clothes product`});
        }

        return newProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronicAttribute = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });

        if (!newElectronicAttribute) {
            throw new ConflictErrorResponse({message: `Error: fail to create new electronic attribute`});
        }

        const newProduct = await products.create({
            ...this,
            _id: newElectronicAttribute._id, 
        });

        if (!newProduct) {
            const deletedDoc = await electronics.findByIdAndDelete(newElectronicAttribute._id);

            if (!deletedDoc) {
                throw new ConflictErrorResponse({message: `Error: fail to create new electronic product and delete created electronic attributes`});
            }

            throw new ConflictErrorResponse({message: `Error: failt to create new electronic product`});
        }

        return newProduct;
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurnitureAttributes = await furnitures.create({
            ...this.product_attributes,
            product_shop: this.product_shop 
        });

        if (!newFurnitureAttributes) {
            throw new ConflictErrorResponse({
                message: `Error: fail to create furniture attribute`,
            });
        }

        const newProduct = await products.create({
            ...this,
            _id: newFurnitureAttributes._id,
        });

        if (!newProduct) {
            const deletedDoc = await furnitures.findByIdAndDelete(newFurnitureAttributes._id);

            if (!deletedDoc) {
                throw new ConflictErrorResponse({
                    message: `Error: fail to create new furniture product and delete created attribute`,
                });
            }

            throw new ConflictErrorResponse({message: `Error: fail to create new product`});
        }

        return newProduct;
    }
}


class ProductFactory {
    static productRegistry = {};

    static registryProduct({product_type, productClass}) {
        ProductFactory.productRegistry[product_type] = productClass;
    }

    static createProduct(payload) {
        const ProductClass = ProductFactory.productRegistry[payload.product_type];

        if (!ProductClass) {
            throw new ConflictErrorResponse({message: `Error: product type ${product_type} is not registered`});
        }

        return new ProductClass(payload).createProduct();
    }

    static async findAllDraftProduct({product_shop, skip, limit = 50}) {
        const query = {
            product_shop: product_shop,
            isDraft: true,
        };

        const result = await findAllProductsWithQuery({query,limit, skip});
        return result;
    }

    static async findAllPublishedProduct({product_shop, skip, limit = 50}) {
        const query = {
            product_shop: product_shop,
            isPublish: true,
        };

        const result = await findAllProductsWithQuery({query, limit, skip});
        return result;
    }

    static async publishAProduct({product_id, product_shop}) {
        const result = await publishAProduct({product_id, product_shop});
        return result;
    }

    static async draftAProduct({product_id, product_shop}) {
        const result = await draftAProduct({product_id, product_shop});
        return result;
    }

    static async findProductByUser({keySearch}) {
        const result = await findProductByUser({keySearch});
        return result;
    }
}

ProductFactory.registryProduct({product_type: 'Clothes', productClass: Clothes});
ProductFactory.registryProduct({product_type: 'Electronic', productClass: Electronic});
ProductFactory.registryProduct({product_type: 'Furniture', productClass: Furniture});

module.exports = ProductFactory;
