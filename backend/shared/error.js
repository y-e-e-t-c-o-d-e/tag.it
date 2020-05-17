class HTTPError extends Error {
    super(status, message, data) {
        this.status = status;
        this.message = message || status;
        this.data = data || {};
    }
}

class Unauthorized extends HTTPError {
    constructor(message) {
        super(401, message);
    }
}

class NotFound extends HTTPError {
    constructor(message) {
        super(404, message);
    }
}

const errorHandler = (err, req, res, next) => {
    res.status(err.status).json({
        error: {
            status: err.status,
            message: err.message,
            ...err.data
        },
    });
};

module.exports = {
    HTTPError,
    Unauthorized,
    NotFound,
    errorHandler
}