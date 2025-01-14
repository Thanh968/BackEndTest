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

module.exports = {
    getDataField,
    getFields
};