"use strict"
const {
    convertStringToObjectId,
    convertStringToDate
} = require("../ultils");
const {BadRequestErrorResponse} = require("../response/error.response");
const {
    createNewDiscount,
    findOneDiscountWithQuery,
    findAllDiscountWithQuery,
    deleteDiscount,
    updateOneDiscount
} = require("../models/repositories/discount.repo");
const DiscountValidator = require('../validators/discount.validator');
const {
    findAllProductsWithQuery
} = require("../models/repositories/product.repositories");
const {
    insertDeletedDiscount
} = require('../models/repositories/deletedDiscount.repo');

const calculateTotalAmountOfDiscounted = (products, applied_products, applies_to) => {
    let result = 0;
    const len = products.length;

    if (applies_to === 'all') {
        for (let i = 0; i < len; i++) {
            result += products[i]['quantity'] * products[i]['price'];
        }
    } else {
        for (let i = 0; i < len; i++) {
            if (applied_products.includes(products[i]['_id'])) {
                result += products[i]['quantity'] * products[i]['price'];
            }
        }
    }

    return result;
}

const calculateTotalPrice = (products) => {
    let total_price = 0;
    const len = products.length;

    for (let i = 0; i < len; i++) {
        total_price += products[i]['quantity'] * products[i]['price'];
    }

    return total_price;
}

const countNumUses = (users_use, user_id) => {
    let num_use_of_user = 0;

    for (let i = 0; i < users_use.length; i++) {
        if (users_use[i] == user_id) {
            num_use_of_user += 1;
        }
    }

    return num_use_of_user;
}

const calculateDiscountAmount = (discounted_price, discount_type, discount_value) => {
    let discounted_money = discount_value;

    if (discount_type === 'percentage') {
        discounted_money = discounted_price * discount_value;
    }

    return discounted_money;
}

class DiscountService {
    static async createDiscount(payload) {
        await DiscountValidator.validateCreatePayload(payload);

        payload.discount_shop_id = convertStringToObjectId(payload.discount_shop_id);
        payload.discount_start_date = convertStringToDate(payload.discount_start_date);
        payload.discount_end_date = convertStringToDate(payload.discount_end_date);

        const new_discount = await createNewDiscount(payload);

        return new_discount;
    }

    static async findAllProductAppliedByThisDiscount(payload) {
        DiscountValidator.validateAppliedDiscountPayload(payload);
        const found_discount = await findOneDiscountWithQuery({
            discount_shop_id: convertStringToObjectId(payload.discount_shop_id),
            discount_code: payload.discount_code,
            discount_is_active: true
        });

        if (!found_discount) {
            throw new BadRequestErrorResponse({message: `Error: this discount code is not exist`});
        }

        DiscountValidator.validateDateOfUseForDiscount(found_discount.discount_start_date, found_discount.discount_end_date);

        const query = {
            product_shop: convertStringToObjectId(payload.discount_shop_id),
            isPublish: true,
            limit: payload.limit,
            skip: payload.page - 1
        };

        if (found_discount.discount_applies_to === "specific") {
            query[_id] = {$in: found_discount.discount_product_ids};
        }

        const product_array = await findAllProductsWithQuery(query);

        return product_array;
    }

    static async getAllDiscountOfShop(payload) {
        DiscountValidator.validatePayloadGetAllDiscountOfShop(payload);
        const current_date = new Date();
        const query = {
            discount_shop_id: convertStringToObjectId(payload.shop_id),
            discount_is_active: true,
            discount_start_date: {$lte: current_date},
            discount_end_date: {$gte: current_date}
        };
        const unselect = ['__v', 'discount_shop_id'];
        const {limit, page} = payload;
        const foundDiscounts = await findAllDiscountWithQuery(query, limit, page, unselect);
        return foundDiscounts;
    }

    static async getDiscountAmount(payload) {
        DiscountValidator.validatePayloadGetDiscountAmount(payload);
        const {discount_code, discount_shop_id, user_id, products} = payload;
        const current_date = new Date();
        const found_discount = await findOneDiscountWithQuery({
            discount_code: discount_code,
            discount_shop_id: convertStringToObjectId(discount_shop_id),
            discount_is_active: true,
            discount_start_date: {$lte: current_date},
            discount_end_date: {$gte: current_date}
        });

        if (!found_discount) {
            throw new BadRequestErrorResponse({message: `Error: discount is not exist or not available`});
        }

        const {discount_max_uses_per_user, discount_users_use, discount_product_ids, discount_applies_to, discount_min_order_value, discount_type, discount_value} = found_discount;
        const num_use_of_user = countNumUses(discount_users_use, user_id);

        if (num_use_of_user >= discount_max_uses_per_user) {
            throw new BadRequestErrorResponse({message: `Error: User not allow to use this discount anymore`});
        }

        const amount_discounted_price = calculateTotalAmountOfDiscounted(products, discount_product_ids, discount_applies_to);

        if (amount_discounted_price < discount_min_order_value) {
            throw new BadRequestErrorResponse({message: `Error: Not enough to uses this discount`});
        }

        const total_price = calculateTotalPrice(products);
        const discounted_amount = calculateDiscountAmount(amount_discounted_price, discount_type, discount_value);
        const must_paid_money = (total_price - discounted_amount > 0) ? (total_price - discounted_amount) : 0;

        return {
            total_price,
            discounted_amount,
            must_paid_money
        };
    }

    static async deleteDiscount(payload) {
        DiscountValidator.validatePayloadDeleteDiscount(payload);
        const {discount_shop_id, discount_code} = payload;
        const found_discount = await findOneDiscountWithQuery({
            discount_shop_id: convertStringToObjectId(discount_shop_id),
            discount_code: discount_code
        });
        
        if (found_discount === null) {
            throw new BadRequestErrorResponse({message: `Error: Not found discount`});
        }

        const deleted_discount = await deleteDiscount(found_discount._id);

        if (deleted_discount === null) {
            throw new BadRequestErrorResponse({message: `Error: fail to delete discount`});
        }

        const saved_deleted_discount = await insertDeletedDiscount(found_discount);

        if (saved_deleted_discount === null) {
            throw new BadRequestErrorResponse({message: `Error: save deleted discount fail`});
        }

        return deleted_discount;
    }

    static async removeDiscountFromUserCart(payload) {
        DiscountValidator.validatePayloadRemoveDiscountFromCart(payload);
        const {discount_code, discount_shop_id, user_id} = payload;
        const current_date = new Date();
        const found_discount = await findOneDiscountWithQuery({
            discount_code: discount_code,
            discount_shop_id: convertStringToObjectId(discount_shop_id),
            discount_is_active: true,
            discount_start_date: {$lte: current_date},
            discount_end_date: {$gte: current_date}
        });

        if (found_discount === null) {
            throw new BadRequestErrorResponse({message: `Error: discount not exist or not available`});
        }

        const result = await updateOneDiscount(found_discount._id, {$pull: {discount_users_use: convertStringToObjectId(user_id)}});

        return result;
    }
}

module.exports = DiscountService