"use strict"
const {
    checkRequiredFields,
    checkInputFieldType,
    areAllIDObjectId,
    areAllNumberPositive,
    areAllStringNonEmpty
} = require('../ultils');
const {
    BadRequestErrorResponse
} = require("../response/error.response");

class ProductValidator {
    static validateCreateProductPayload(payload) {
        const required_fields = ['product_name', 'product_description', 'product_thumb', 'product_type', 'product_price', 'product_quantity', 'product_shop', 'product_attributes'];
        const schema = {
            'product_name': 'string',
            'product_description': 'string',
            'product_thumb': 'string',
            'product_type': 'string',
            'product_price': 'number',
            'product_quantity': 'number',
            'product_shop': 'string',
            'product_attributes': 'object',
        };

        const is_enough_field = checkRequiredFields(payload, required_fields);
        
        if (is_enough_field === false) {
            throw new BadRequestErrorResponse({message: 'Error: Missing required fields'});
        }

        const is_valid_fields = checkInputFieldType(payload, schema);

        if (is_valid_fields === false) {
            throw new BadRequestErrorResponse({message: 'Error: Invalid input field type'});
        }

        const {
            product_name,
            product_description,
            product_thumb,
            product_type,
            product_price,
            product_quantity,
            product_shop,
            product_attributes
        } = payload;
        const str_arr = [product_name, product_description, product_thumb, product_type, product_shop];
        const num_arr = [product_price, product_quantity];
        const id_string_arr = [product_shop];
        const is_all_id_objectid = areAllIDObjectId(id_string_arr);

        if (is_all_id_objectid === false) {
            throw new BadRequestErrorResponse({message: 'Error: Invalid shop id'});
        }

        const is_all_str_non_empty = areAllStringNonEmpty(str_arr);

        if (is_all_str_non_empty === false) {
            throw new BadRequestErrorResponse({message: 'Error: Empty string'});
        }

        const is_all_num_positive = areAllNumberPositive(num_arr);

        if (is_all_num_positive === false) {
            throw new BadRequestErrorResponse({message: 'Error: Negative number'});
        }
    }
    
    static validateFindAllDraftProductPayload(payload) {
        const required_fields = ['product_shop', 'skip', 'limit']; 
        const schema = {
            'product_shop': 'string',
            'skip': 'number',
            'limit': 'number'
        };


        const is_enough_field = checkRequiredFields(payload, required_fields);

        if (is_enough_field === false) {
            throw new BadRequestErrorResponse({message: 'Error: Missing required fields'});
        }

        payload.limit = parseInt(payload.limit);
        payload.skip = parseInt(payload.skip);

        if (isNaN(payload.limit) || isNaN(payload.skip)) {
            throw new BadRequestErrorResponse({message: 'Error: Invalid input field type'});
        }

        const is_valid_fields = checkInputFieldType(payload, schema);

        if (is_valid_fields === false) {
            throw new BadRequestErrorResponse({message: 'Error: Invalid input field type'});
        }
    }
}

module.exports = ProductValidator;