`use strict`
const _ = require(`lodash`);

const getDataField = (object, fields) => {
    const result =_.pick(object,fields);
    return result;
}

module.exports = {
    getDataField,
};