`use strict`
const _ = require(`lodash`);

const getDataField = (object, fields) => {
    const result =_.pick(object,fields);
    return result;
}

const getFields = (select = []) => {
    const result = Object.fromEntries(select.map((field) => [field, 1]));
    return result;
}

const removeNullField = (object) => {
    Object.keys(object).forEach(key => {
        if (object[key] == null) {
            delete object[key];
        }
    });
    return object;
} 

const checkRequiredFields = (object, fields) => {
    const result = fields.every(field => field in object);
    return result;
}

module.exports = {
    getDataField,
    getFields,
    removeNullField,
    checkRequiredFields
};