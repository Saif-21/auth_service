export default class APIError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = new.target.name;

        Error.captureStackTrace(this, this.constructor);
    }

    static validationError(message = 'Validation failed', status = 422) {
        return new APIError(message, status);
    }

    static notFound(message = 'Resource not found', status = 404) {
        return new APIError(message, status);
    }

    static internalError(message = 'Internal server error', status = 500) {
        return new APIError(message, status);
    }

    static unauthorized(message = 'Unauthorized', status = 401) {
        return new APIError(message, status);
    }

    static forbidden(message = 'Forbidden', status = 403) {
        return new APIError(message, status);
    }

    static conflict(message = 'Conflict', status = 409) {
        return new APIError(message, status);
    }

    static badRequest(message = 'Bad request', status = 400) {
        return new APIError(message, status);
    }

    static internal(message = 'Internal server error', status = 500) {
        return new APIError(message, status);
    }
}
