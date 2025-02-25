"use strict"
const {
    findAllMissingFields,
    convertStringToDate,
    isValidObjectIdFormat,
    checkValidDateForEvent,
    convertStringToObjectId,
    findAllExistField
} = require("../ultils");
const {BadRequestErrorResponse} = require("../response/error.response");

const {
    countExistProducts
} = require(`../models/repositories/product.repositories`);

const {
    createNewDiscount,
    checkDiscountExist
} = require("../models/repositories/discount.repo");

class DiscountService {
    static async createDiscount(payload) {
        const required_fields = ["discount_name", "discount_description", "discount_value", "discount_code"
            , "discount_start_date", "discount_end_date", "discount_shop_id"];
        const not_allow_fields = ["discount_uses_count", "discount_users_use"];

        const missing_fields = findAllMissingFields(payload, required_fields);
        const exist_not_allow_fields = findAllExistField(payload, not_allow_fields);

        if (missing_fields.length > 0) {
            throw new BadRequestErrorResponse({message: `Missing fields: ${missing_fields.join(", ")}`});
        }

        if (exist_not_allow_fields.length !== 0) {
            throw new BadRequestErrorResponse({message: `Not allow fields: ${exist_not_allow_fields.join(", ")}`});
        }

        const {discount_type} = payload;

        if (discount_type !== undefined) {
            if (discount_type !== "percentage" && discount_type !== "fixed_amount") {
                throw new BadRequestErrorResponse({message: `Error: Invalid discount type`});
            } 
            else if (discount_type === "percentage") {
                if (payload.discount_value <= 0 || payload.discount_value > 100) {
                    throw new BadRequestErrorResponse({message: `Error: invalid discount value`});
                }
            }
            else if (discount_type === "fixed_amount") {
                if (payload.discount_value <= 0) {
                    throw new BadRequestErrorResponse({message: `Error: invalid discount value`});
                }
            }
        } else {
            if (payload.discount_value <= 0 || payload.discount_value > 100) {
                throw new BadRequestErrorResponse({message: `Error: invalid discount value`});
            }
        }

        if (payload.discount_max_uses <= 0) {
            throw new BadRequestErrorResponse({message: `Error: invalid max uses num for this discount`});
        }

        if (!isValidObjectIdFormat(payload.discount_shop_id)) {
            throw new BadRequestErrorResponse({message: "Error: Invalid shop id format"});
        }

        const start_date = convertStringToDate(payload.discount_start_date);
        const end_date = convertStringToDate(payload.discount_end_date);

        if (!start_date || !end_date) {
            throw new BadRequestErrorResponse({message: "Error: Invalid date format"});
        }

        if (!checkValidDateForEvent(start_date, end_date)) {
            throw new BadRequestErrorResponse({message: `Error: Invalid date value`});
        }

        if (payload.discount_min_order_value !== undefined) {
            if (payload.discount_min_order_value < 0) {
                throw new BadRequestErrorResponse({message: `Error: min order value must be a non-negative number`});
            }
        }

        if (payload.discount_applies_to !== undefined) {
            const {discount_applies_to} = payload;

            if (discount_applies_to !== "all" && discount_applies_to !== "specific") {
                throw new BadRequestErrorResponse({message: "Error: invalid discount applies to"});
            } 
            else if (discount_applies_to === "specific") {
                if (!payload.discount_product_ids) {
                    throw new BadRequestErrorResponse({message: `Error: require product for specific discount applies to`});
                } else if (payload.discount_product_ids.length === 0) {
                    throw new BadRequestErrorResponse({message: `Error: require product for specific discount applies to`});
                }

                const num_exist_product = await countExistProducts(convertStringToObjectId(payload.discount_shop_id), payload.discount_product_ids);

                if (num_exist_product !== payload.discount_product_ids.length) {
                    throw new BadRequestErrorResponse({message: `Error: not all products belong to shop`});
                }
            }
        }

        if (payload.discount_max_uses_per_user !== undefined) {
            const {discount_max_uses_per_user} = payload;

            if (discount_max_uses_per_user <= 0) {
                throw new BadRequestErrorResponse({message: `Error: invalid max uses per user`});
            }
        }

        if (payload.discount_max_uses !== undefined) {
            const {discount_max_uses} = payload;

            if (discount_max_uses <= 0) {
                throw new BadRequestErrorResponse({message: `Error: Invalid discount max uses`});
            }
        }

        const is_discount_exist = await checkDiscountExist(convertStringToObjectId(payload.discount_shop_id), payload.discount_code);

        if (is_discount_exist) {
            throw new BadRequestErrorResponse({message: `Error: This code already exist`});
        }

        payload.discount_shop_id = convertStringToObjectId(payload.discount_shop_id);
        payload.discount_start_date = start_date;
        payload.discount_end_date = end_date;

        const new_discount = await createNewDiscount(payload);

        return new_discount;
    }

    
}

module.exports = DiscountService