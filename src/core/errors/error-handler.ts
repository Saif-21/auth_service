import { Request, Response, NextFunction } from 'express';
import APIError from './api-error';
import { errorResponse } from '../apiError';

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let statusCode = 500;

    let message = 'Internal Server Error';

    if (error instanceof APIError) {
        statusCode = error.statusCode;
        message = error.message;
    } else if (error.code === 11000) {
        statusCode = 409;
        message = 'Duplicate field value';
    } else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    } else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    } else if (error.name === 'ValidationError') {
        statusCode = 400;
        const messages = Object.values(error.errors).map((err: any) => err.message);
        message = messages.join(', ');
        
        // Make it even more friendly
        if (message.includes('is required')) {
            message = message.replace(/Path `(\w+)` is required\./g, '$1 is required.');
        }
        if (message.includes('is not a valid enum value')) {
            message = message.replace(/`(\w+)` is not a valid enum value for path `(\w+)`\./g, '$1 is not a valid option for $2.');
        }
    } else if (error.message) {
        statusCode = 400;
        message = error.message;
    }

    const response: any = {
        success: false,
        statusCode,
        message,
    };

    if (process.env.NODE_ENV === 'development') {
        response.stack = error.stack;
    }

    console.error(`Error: ${message}`);
    // res.status(statusCode).json(response);
    errorResponse(res,  response);
};