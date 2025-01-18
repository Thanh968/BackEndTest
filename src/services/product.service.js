'use strict'

const {products, clothes, electronics, furnitures} = require('../models/products.model');
const {ConflictErrorResponse, BadRequestErrorResponse} = require(`../response/error.response`);
const { 
    checkRequiredFields, 
    getFields, 
    removeNullField,
    getDataField
} = require(`../ultils/index`);
const {
    findAllProductsWithQuery, 
    publishAProduct, 
    draftAProduct, 
    findProductByUser,
    findAllProducts, 
    findProduct,
    updateProduct,
    updateClothes,
    updateElectronics,
    updateFurnitures,
    deleteProduct,
    deleteClothes,
    deleteElectronics,
    deleteFurnitures,
} = require(`../models/repositories/product.repositories`);

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

    async updateProduct() {
        const filter = {
            _id: this.product_id,
            product_shop: this.product_shop,
        };
        const updateData = this;
        const result = await updateProduct({filter, updateData});

        if (!result) {
            throw new ConflictErrorResponse({message: `Error: fail to update product`});
        }

        return result;
    }

    async deleteProduct() {
        const deletedCount = await deleteProduct({product_id: this.product_id, product_shop: this.product_shop});
        let message = `Product not found`;

        if (deletedCount === 1) {
            message = `Product deleted successfully`;
        }

        return {message};
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

    async updateProduct() {
        if (this.product_attributes) {
            const filter = {
                _id: this.product_id,
                product_shop: this.product_shop,
            };
            const updateData = this;
            const updateAttributes = await updateClothes({filter, updateData});

            if (!updateAttributes) {
                throw new ConflictErrorResponse({message: `Error: fail to update product`});
            }

            this.product_attributes = getDataField(updateAttributes, ['brand', 'size', 'color']);
        }

        const result = await super.updateProduct();

        return result;
    }

    async deleteProduct() {
        const deletedCount = await deleteClothes({product_id: this.product_id, product_shop: this.product_shop});
        let message = `Product not found`;

        if (deletedCount === 1) {
            message = (await super.deleteProduct()).message;
        }

        return {message};
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

    async updateProduct() {
        if (this.product_attributes) {
            const filter = {
                _id: this.product_id,
                product_shop: this.product_shop,
            };
            const updateData = this;
            const updateAttributes = await updateElectronics({filter, updateData});

            if (!updateAttributes) {
                throw new ConflictErrorResponse({message: `Error: fail to update product`});
            }

            this.product_attributes = getDataField(updateAttributes, ['manufacturer', 'model', 'color']);
        }

        const result = await super.updateProduct();

        return result;
    }

    async deleteProduct() {
        const deletedCount = await deleteElectronics({product_id: this.product_id, product_shop: this.product_shop});
        let message = `Product not found`;

        if (deletedCount === 1) {
            message = (await super.deleteProduct()).message;
        }

        return {message};
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

    async updateProduct() {
        if (this.product_attributes) {
            const filter = {
                _id: this.product_id,
                product_shop: this.product_shop,
            };
            const updateData = this;
            const updateAttributes = await updateFurnitures({filter, updateData});

            if (!updateAttributes) {
                throw new ConflictErrorResponse({message: `Error: fail to update product`});
            }

            this.product_attributes = getDataField(updateAttributes, ['brand', 'size', 'material']);
        }

        const result = await super.updateProduct();

        return result;
    }

    async deleteProduct() {
        const deletedCount = await deleteFurnitures({product_id: this.product_id, product_shop: this.product_shop});
        let message = `Product not found`;

        if (deletedCount === 1) {
            message = (await super.deleteProduct()).message;
        }

        return {message};
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

    static async findAllProducts({limit = 50, page = 1, sort = 'ctime', select}) {
        const result = await findAllProducts({limit, page, sort, select});
        return result;
    }

    static async findProduct({product_id, select}) {
        const result = await findProduct({product_id, select});
        console.log(result);
        return result;
    }

    static async updateProduct({product_shop, payload}) {
        payload.product_shop = product_shop;
        const updateData = removeNullField(payload);

        if (!checkRequiredFields(updateData, ['product_id', 'product_type'])) {
            throw new ConflictErrorResponse({message: `Error: product_id and product_type are required`});
        }

        if (updateData.product_attributes) {
            updateData.product_attributes = removeNullField(updateData.product_attributes);

            if (Object.keys(updateData.product_attributes).length === 0) {
                delete updateData.product_attributes;
            }
        }

        const productClass = ProductFactory.productRegistry[updateData.product_type];

        if (!productClass) {
            throw new ConflictErrorResponse({message: `Error: product type ${updateData.product_type} is not registered`});
        }

        const newInstance = new productClass(updateData);
        newInstance.product_id = updateData.product_id;
        const result = await newInstance.updateProduct();

        return result;
    }

    static async deleteProduct({product_id, product_shop, product_type}) {
        if (!product_id || !product_shop || !product_type) {
            throw new BadRequestErrorResponse({message: `Error: product_id, product_shop, product_type are required`});
        }

        const productClass = ProductFactory.productRegistry[product_type];

        if (!productClass) {
            throw new BadRequestErrorResponse({message: `Error: product type ${product_type} is not registered`});
        }

        const newObject = new productClass({product_type, product_shop});
        newObject.product_id = product_id;
        const result = await newObject.deleteProduct();

        return result;
    }
}


ProductFactory.registryProduct({product_type: 'Clothes', productClass: Clothes});
ProductFactory.registryProduct({product_type: 'Electronic', productClass: Electronic});
ProductFactory.registryProduct({product_type: 'Furniture', productClass: Furniture});

module.exports = ProductFactory;
