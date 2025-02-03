"use strict"

const {model, Schema} = require("mongoose");

const  COLLECTION_NAME = 'Inventories';
const DOCUMENT_NAME = 'Inventory';

const inventorySchema = new Schema({
    inven_productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    inven_shopId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    inven_stock: {
        type: Number,
        required: true,
        min: [0, "stock must be a positive number"]
    },
    inven_location: {
        type: String,
        default: 'unknown'
    },
    inven_reservations: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}