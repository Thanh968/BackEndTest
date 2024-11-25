'use strict'

class SuccessResponse {
    constructor({message, statusCode, metadata}) {
        this.message = message;
        this.statusCode = statusCode;
        this.metadata = metadata;
    }

    static send = (res) => {
        return  res.stauts(this.statusCode).json(this);
    }
}

