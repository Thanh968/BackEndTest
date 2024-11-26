'use strict'

const SUCCESS_CODE = {
    OK: 200,
    CREATED: 201,
};

const SUCCESS_MESSAGE = {
    OK: 'OK',
    CREATED: 'CREATED',
};

class SuccessResponse {
    constructor({message, statusCode, metadata}) {
        this.message = message;
        this.statusCode = statusCode;
        this.metadata = metadata;
    }

    send(res) {
        return  res.status(this.statusCode).json(this);
    }
}

class OkSuccessResponse extends SuccessResponse{
    constructor({message = SUCCESS_MESSAGE.OK, statusCode = SUCCESS_CODE.OK, metadata}) {
        super({message, statusCode, metadata});
    }
}

class CreatedSuccessResponse extends SuccessResponse {
    constructor({message = SUCCESS_MESSAGE.CREATED, statusCode = SUCCESS_CODE.CREATED, metadata}) {
        super({message, statusCode, metadata});
    }
}

module.exports = {
    OkSuccessResponse,
    CreatedSuccessResponse,
};



