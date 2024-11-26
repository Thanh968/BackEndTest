'use strict'

const { model } = require("mongoose");
const shopModel = require(`../models/shop.model`);

/*    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false,
    },
    roles: {
        type: Array,
        default: [],
    }, */

class ShopService {
    static async createNewShop({email, name, password}) {
        const newShop = await shopModel.create({
            email: email,
            name: name,
            password: password,
        });
        return newShop;
    }

    static async findShopByEmail(email) {
        const holderShop = await shopModel.findOne({email: email}).lean();
        return holderShop;
    }
}

module.exports = ShopService;