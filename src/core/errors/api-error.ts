export default class APIError extends Error {
    public statusCode: number;

    constructor(statusCode = 500, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.name = new.target.name;

        Error.captureStackTrace(this, this.constructor);
    }

    static validationError(message = 'Validation failed', status = 422) {
        return new APIError(status, message);
    }

    static notFound(message = 'Resource not found', status = 404) {
        return new APIError(status, message);
    }

    static internalError(message = 'Internal server error', status = 500) {
        return new APIError(status, message);
    }

    static unauthorized(message = 'Unauthorized', status = 401) {
        return new APIError(status, message);
    }

    static forbidden(message = 'Forbidden', status = 403) {
        return new APIError(status, message);
    }

    static conflict(message = 'Conflict', status = 409) {
        return new APIError(status, message);
    }

    static badRequest(message = 'Bad request', status = 400) {
        return new APIError(status, message);
    }
}