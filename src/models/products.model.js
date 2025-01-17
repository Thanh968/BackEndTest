'use strict'

const {model, Schema} = require(`mongoose`);
const slugify = require(`slugify`);

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = `Products`;

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_description: {
        type: String,
        required: true,
    },
    product_thumb: {
        type: String,
        required: true,
    },
    product_type: {
        type: String,
        enum: ["Clothes", "Electronic", "Furniture"],
        required: true,
    },
    product_price: {
        type: Number,
        required: true,
        min: [0, "price of product must be greater than 0"]
    },
    product_quantity: {
        type: Number,
        required: true,
        min: [0, `quantity must be a positive number`]
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true,
    },
    product_slug: {
        type: String,
    },
    product_avg_rating: {
        type: Number,
        default: 4.5,
        min: [0, `avg rating must be greater than 0`],
        max: [5, `avg rating must be less than 5`],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
        type: Array,
        default: [],
    },
    isDraft: {
        type: Boolean,
        default: true,
        select: false,
        index: true,
    },
    isPublish: {
        type: Boolean,
        default: false,
        select: false,
        index: true,
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

productSchema.index({product_name: 'text', product_description: 'text'});

productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, {lower: true});
    next();
});

productSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();

    if (update.product_name) {
        update.product_slug = slugify(update.product_name, {lower: true});
        this.setUpdate(update);
    }

    next();
});

const clothesSchema = new Schema({
    brand: {type: String, required: true},
    size: {type: String, required: true},
    material: {type: String, required: true},
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
}, {
    timestamps: true,
    collection: 'Clothes',
});

const electronicSchema = new Schema({
    manufacturer: {type: String, required: true},
    model: {type: String},
    color: {type: String},
    product_shop: {type: Schema.Types.ObjectId, ref: `Shop`},
}, {
    timestamps: true,
    collection: 'Electronic',
});

const furnitureSchema = new Schema({
    brand: {type: String, required: true},
    size: {type: String},
    material: {type: String},
    product_shop: {type: Schema.Types.ObjectId, ref: `Shop`},
}, {
    collection: `Furniture`,
    timestamps: true,
});

module.exports = {
    products: model(DOCUMENT_NAME, productSchema),
    clothes: model('clothe', clothesSchema),
    electronics: model('electronic', electronicSchema),
    furnitures: model(`furniture`, furnitureSchema),
};