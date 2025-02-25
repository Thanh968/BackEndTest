"use strict"

const {model, Schema} = require("mongoose")

const COLLECTION_NAME = "discounts";
const DOCUMENT_NAME = "discount";

const discountSchema = new Schema({
    discount_name: {type: String, required: true},
    discount_description: {type: String, required: true},
    discount_type: {type: String, enum: ["percentage", "fixed_amount"], default: "percentage"},
    discount_value: {type: Number, required: true, min: [0, "Discount value must be a positive number"]},
    discount_code: {type: String, required: true, index: true},
    discount_start_date: {type: Date, required: true},
    discount_end_date: {type: Date, required: true},
    discount_max_uses: {type: Number, default: Number.MAX_SAFE_INTEGER, min: [0, "Discount max uses must be a positive number"]},
    discount_uses_count: {type: Number, default: 0},
    discount_users_use: {type: Array, default: []},
    discount_max_uses_per_user: {type: Number, default: Number.MAX_SAFE_INTEGER, min: [0, "Discount max uses per user must be a positive number"]},
    discount_min_order_value: {type: Number, default: 0, min: [0, "Discount min order value must be a positive number"]},
    discount_shop_id: {type: Schema.Types.ObjectId, ref: 'Shop', required: true, index: true},
    discount_is_active: {type: Boolean, default: true, index: true},
    discount_applies_to: {type: String, default: 'all', enum: ['all', 'specific']},
    discount_product_ids: {type: Array, required: true}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, discountSchema);