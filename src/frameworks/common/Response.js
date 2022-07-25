module.exports.Response = class Response {
    constructor({status = false, error = null, content = null}) {
        this.status = status;
        this.error = error;
        this.data = content;
    }
};

module.exports.ResponseError = class ResponseError {
    constructor({status, msg, reason, url, ip, validationError = []}) {
        this.status = status;
        this.msg = msg;
        this.reason = reason;
        this.url = url;
        this.ip = ip;
        this.validationError = validationError;
    }
};

module.exports.ValidationError = class ValidationError {
    constructor({field, msg}) {
        this.field = field;
        this.msg = msg;
    }
};