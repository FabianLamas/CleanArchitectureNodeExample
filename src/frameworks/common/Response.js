module.exports.Response = class Response {
    constructor({statusCode = false, error = null, content = null}) {
        this.statusCode = statusCode;
        this.error = error;
        this.data = content;
    }
};

module.exports.ResponseError = class ResponseError {
    constructor({statusCode, msg, url, ip}) {
        this.statusCode = statusCode;
        this.msg = msg;
        this.url = url;
        this.ip = ip;
    }
};