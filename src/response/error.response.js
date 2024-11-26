'use strict'

const ERROR_CODE = {
    UNAUTHORIZED: 401,
    CONFLICT: 409,
    INTERNAL_SERVER: 500,
};

const ERROR_MESSAGE = {
    UNAUTHORIZED: "Unauthorized",
    CONFLICT: "conflict",
    INTERNAL_SERVER: "Internal server error",
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

class InternalServerErrorResponse extends ErrorResponse {
    constructor({message = ERROR_MESSAGE.INTERNAL_SERVER, statusCode = ERROR_CODE.INTERNAL_SERVER}) {
        super({message, statusCode});
    }
}

module.exports = {
    UnauthorizedErrorResponse,
    ConflictErrorResponse,
    InternalServerErrorResponse,
};

