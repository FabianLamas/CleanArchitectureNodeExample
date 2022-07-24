module.exports.Response = class Response {
    constructor({status = false, error = null, content = null}) {
        this.status = status;
        this.error = error;
        this.data = content;
    }
};

module.exports.ResponseError = class ResponseError {
    constructor({status, msg, url, ip}) {
        this.status = status;
        this.msg = msg;
        this.url = url;
        this.ip = ip;
    }
};