const { Response, ResponseError } = require('../Common');

module.exports = (err, req, res, next) => {
    
    const error = new ResponseError({
        status: err.status || 500,
        msg: err.message || err.msg || 'Internal Server Error',
        reason: err.reason || err.stack || 'Something went wrong',
        url: req.originalUrl || req.url,
        ip: req.ip,
        validationErrors: err.validationErrors 
    });

    res.status(error.status);
    res.json(new Response({
        status: false,
        error
    }));
};