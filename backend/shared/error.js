class HTTPError extends Error {
    constructor(status, message, data) {
        super(message || status);
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

class InternalServerError extends HTTPError {
    constructor(message) {
        super(500, message)
    }
}

const errorHandler = (err, req, res, next) => {
    if (!err.status) {
        return next(new InternalServerError("No Error Status Given"))
    }

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
    InternalServerError,
    errorHandler
}