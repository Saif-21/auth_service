import { Request, Response, NextFunction } from 'express';
import APIError from '@/core/errors/api-error';

import jwtUtil, { AccessTokenPayload } from '@/utils/jwt.util';

export interface AuthenticatedRequest extends Request {
    user: AccessTokenPayload;
}

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        let token: string | undefined;
        const authorization = req.header('authorization');
        if (authorization && authorization.startsWith('Bearer ')) {
            token = authorization.substring(7);
        }

        if (!token && req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            throw APIError.unauthorized('Authentication required.');
        }

        const payload = jwtUtil.verifyAccessToken(token);

        (req as AuthenticatedRequest).user = payload;

        next();
    } catch (error) {
        if (error instanceof APIError) {
            next(error);
            return;
        }

        next(APIError.unauthorized('Invalid or expired access token.'));
    }
};
