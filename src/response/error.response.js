'use strict'

const ERROR_CODE = {
    UNAUTHORIZED: 401,
    CONFLICT: 409
};

const ERROR_MESSAGE = {
    UNAUTHORIZED: 401,
    CONFLICT: 409,
};

class ErrorResponse extends Error {
    constructor({message, statusCode}) {
        super(message);
        this.statusCode = statusCode;
    }
}

class UnauthorizedErrorResponse extends ErrorResponse {
    constructor({message = ERROR_MESSAGE.UNAUTHORIZED, statusCode = ERROR_CODE.UNAUTHORIZED}) {
        super({message, statusCode});
    }
}

class ConflictErrorResponse extends ErrorResponse {
    constructor({message = ERROR_MESSAGE.CONFLICT, statusCode = ERROR_CODE.CONFLICT}) {
        super({message, statusCode});
    }
}

module.exports = {
    UnauthorizedErrorResponse,
    ConflictErrorResponse,
};

