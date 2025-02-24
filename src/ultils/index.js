`use strict`
const _ = require(`lodash`);
const {Types} = require(`mongoose`);

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

const findAllMissingFields = (object, fields) =>{
    const result = fields.filter(field => !(object[field]));
    return result;
}

const checkLeapYear = (year) => {
    if (year % 400 == 0) return true;
    if (year % 100 == 0) return false;
    if (year % 4 == 0) return true;
    return false;
}

const convertStringToDate = (date_string) => {
    const nums_array = date_string.split("-").map(num => parseInt(num));
    const months_have_31_dates = [1, 3, 5, 7, 8, 10, 12];
    let is_valid_date = true;

    if (nums_array.length !== 3) {
        is_valid_date = false;
    }

    const [year, month, day] = nums_array;
    is_valid_date = !(isNaN(year) || year < 0 || 
                    isNaN(month) || month < 1 ||
                    isNaN(day) || day < 1);

    if (month in months_have_31_dates) {
        is_valid_date = (day <= 31);
    } else if (month !== 2) {
        is_valid_date = (day <= 30);
    } else {
        if (checkLeapYear(year)) {
            is_valid_date = (day <= 29);
        } else {
            is_valid_date = (day <= 28);
        }
    }

    if (!is_valid_date) {
        return null;
    }

    const result_date = new Date(year, month - 1, day);
    return result_date;
}

const isValidObjectIdFormat = (id_string) => {
    const is_valid_objectid_format = Types.ObjectId.isValid(id_string);
    return is_valid_objectid_format;
}

const checkValidDateForEvent = (start_date, end_date) => {
    const is_valid_event_date = (start_date < end_date) && (start_date > new Date());
    return is_valid_event_date;
}

const convertStringToObjectId = (str_data) => {
    const result = Types.ObjectId(str_data);
    return result;
}
}

module.exports = {
    getDataField,
    getFields,
    removeNullField,
    checkRequiredFields,
    findAllMissingFields,
    convertStringToDate,
    isValidObjectIdFormat,
    checkValidDateForEvent,
    convertStringToObjectId
};