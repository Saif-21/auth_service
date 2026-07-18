import { errorResponse } from '@/core/apiError';
import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';

export const validate =
    (schema: ObjectSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return errorResponse(res, {
                statusCode: 400,
                success: false,
                message: 'Request payload is missing.',
            });
        }

        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: true,
        });

        if (error) {
            const data = {
                statusCode: 400,
                success: false,
                message: 'Validation Error',
                errors: error.details.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                })),
            };
            return errorResponse(res, data);
        }

        req.body = value;

        next();
    };
