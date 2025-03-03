"use strict"
const { BadRequestErrorResponse } = require('../response/error.response');
const {
    findAllExistField,
    findAllMissingFields,
    convertStringToDate,
    checkValidDateForEvent,
    convertStringToObjectId,
    isValidObjectIdFormat,
    checkInputFieldType
} = require('../ultils/index');

const { countExistProducts } =  require('../models/repositories/product.repositories');
const { 
    checkDiscountExist,
} = require('../models/repositories/discount.repo');

const validateRequiredFields = (payload, required_fields) => {
    const missing_fields = findAllMissingFields(payload, required_fields);

    if (missing_fields.length > 0) {
        throw new BadRequestErrorResponse({message: `Missing fields: ${missing_fields.join(", ")}`});
    }
}

const validateNotAllowFields = (payload, not_allow_fields) => {
    const exist_fields = findAllExistField(payload, not_allow_fields);

    if (exist_fields.length) {
        throw new BadRequestErrorResponse({message: `Not allow fields: ${exist_fields.join(", ")}`});
    }
}

const validateDiscountType = (payload) => {
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
}

const validateDateData = (payload) => {
    const start_date = convertStringToDate(payload.discount_start_date);
    const end_date = convertStringToDate(payload.discount_end_date);

    if (!start_date || !end_date) {
        throw new BadRequestErrorResponse({message: "Error: Invalid date format"});
    }

    if (!checkValidDateForEvent(start_date, end_date)) {
        throw new BadRequestErrorResponse({message: `Error: Invalid date value`});
    }
}

const validateDiscountMaxUses = (payload) => {
    const {discount_max_uses} = payload;
    
    if (discount_max_uses !== undefined && discount_max_uses <= 0) {
        throw new BadRequestErrorResponse({message: `Error: invalid max uses`});
    }
}

const validateDiscountMinOrderValue = (payload) => {
    if (payload.discount_min_order_value !== undefined) {
        if (payload.discount_min_order_value < 0) {
            throw new BadRequestErrorResponse({message: `Error: min order value must be a non-negative number`});
        }
    }
}

const validateDiscountAplliesTo = async (payload) => {
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
}

const validateMaxUsesPerUser = (payload) => {
    if (payload.discount_max_uses_per_user !== undefined) {
        const {discount_max_uses_per_user} = payload;

        if (discount_max_uses_per_user <= 0) {
            throw new BadRequestErrorResponse({message: `Error: invalid max uses per user`});
        }
    }
}


const validateDiscounNotExist = async (payload) => {
    const is_discount_exist = await checkDiscountExist(convertStringToObjectId(payload.discount_shop_id), payload.discount_code);

    if (is_discount_exist) {
        throw new BadRequestErrorResponse({message: `Error: This code already exist`});
    }
}

class DiscountValidator {
    static async validateCreatePayload(payload) {
        const required_fields = ["discount_name", "discount_description", "discount_value", "discount_code"
            , "discount_start_date", "discount_end_date", "discount_shop_id"];
        const not_allow_fields = ["discount_uses_count", "discount_users_use"];
        const not_promise_validate_array = [
            validateDiscountType, validateDateData, validateDiscountMaxUses, 
            validateDiscountMinOrderValue, validateMaxUsesPerUser
        ];
        const promise_validate_array = [validateDiscountAplliesTo, validateDiscounNotExist];

        validateRequiredFields(payload, required_fields);
        validateNotAllowFields(payload, not_allow_fields);

        for (let i = 0; i < not_promise_validate_array.length; i++) {
            not_promise_validate_array[i](payload);
        }

        for (let i = 0; i < promise_validate_array.length; i++) {
            await promise_validate_array[i](payload);
        }
    }

    static validateAppliedDiscountPayload(payload) {
        const required_fields = ['discount_shop_id', 'discount_code', 'limit', 'page'];
        validateRequiredFields(payload, required_fields);
    }

    static validateDateOfUseForDiscount(discount_start_date, discount_end_date) {
        let current_date = new Date();
        const is_valid_time = (discount_start_date <= current_date && current_date <= discount_end_date);

        if (!is_valid_time) {
            throw new BadRequestErrorResponse({message: `Error: Ma khuyen mai khong trong thoi gian su dung`});
        }
    }

    static validatePayloadGetAllDiscountOfShop(payload) {
        const required_fields = ['shop_id', 'limit', 'page'];
        validateRequiredFields(payload, required_fields);
        const {page} = payload;

        if (!isValidObjectIdFormat(payload['shop_id'])) {
            throw new BadRequestErrorResponse({message: `Error: Invalid object id format`});
        }

        if (page <= 0) {
            throw new BadRequestErrorResponse({message: `Error: Invalid page value`});
        }
    }

    static validatePayloadGetDiscountAmount(payload) {
        const required_fields = ['discount_code', 'discount_shop_id', 'user_id', 'products'];
        validateRequiredFields(payload, required_fields);
        const schema = {
            discount_code: 'string',
            discount_shop_id: 'string',
            user_id: 'string',
            products: 'array'
        };
        if (!checkInputFieldType(payload, schema)) {
            throw new BadRequestErrorResponse({message: `Error: Invalid input field type`});
        }
        if (!isValidObjectIdFormat(payload['discount_shop_id']) || !isValidObjectIdFormat(payload['user_id'])) {
            throw new BadRequestErrorResponse({message: `Error: Invalid object id format`});
        }

    }

    static validatePayloadDeleteDiscount(payload) {
        const required_fields = ['discount_shop_id', 'discount_code'];
        const schema = {
            discount_shop_id: 'string',
            discount_code: 'string'
        };
        validateRequiredFields(payload, required_fields);
        if (!checkInputFieldType(payload, schema)) {
            throw new BadRequestErrorResponse({message: `Error: Invalid input field type`});
        }
        if (!isValidObjectIdFormat(payload.discount_shop_id)) {
            throw new BadRequestErrorResponse({message: `Error: Invalid object id format`});
        }
    }
}

module.exports = DiscountValidator;