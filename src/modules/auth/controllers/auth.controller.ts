import { asyncHandler } from '@/core/errors/async-handler';
import { sendResponse } from '@/core/response';
import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { RegisterDTO } from '../dto/register.dto';
import APIError from '@/core/errors/api-error';
import { TokenTransport } from '@/modules/client/types/client.types';
import { LoginDTO } from '../dto/login.dto';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { ForgotPasswordDTO } from '../dto/forgot-password.dto';
import { ResetPasswordDTO } from '../dto/reset-password.dto';
import { UpdateProfileDTO } from '../dto/update-profile.dto';

export const registerController = asyncHandler(
    async (req: Request, res: Response) => {
        const clientId = req.header('x-client-id');

        if (!clientId) {
            throw APIError.badRequest('X-Client-Id header is required.');
        }

        const requestData: RegisterDTO = {
            ...req.body,
            clientId,
            ipAddress: req.ip!,
            userAgent: req.header('user-agent') ?? '',
            browser: req.header('sec-ch-ua') as string,
            os: req.header('sec-ch-ua-platform') as string,
        };

        const result = await authService.registerUser(requestData);

        const { accessToken, refreshToken } = result.data;

        if (result.tokenTransport === TokenTransport.COOKIE) {
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000,
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            return sendResponse(res, {
                ...result,
                data: {
                    user: result.data.user,
                },
            });
        }

        return sendResponse(res, result);
    },
);

export const loginController = asyncHandler(
    async (req: Request, res: Response) => {
        const clientId = req.header('x-client-id');

        if (!clientId) {
            throw APIError.badRequest('X-Client-Id header is required.');
        }

        const requestData: LoginDTO = {
            ...req.body,
            clientId,
            ipAddress: req.ip ?? '',
            userAgent: req.header('user-agent') ?? '',
            browser: req.header('sec-ch-ua') ?? undefined,
            os: req.header('sec-ch-ua-platform') ?? undefined,
        };

        const result = await authService.loginUser(requestData);

        const { accessToken, refreshToken } = result.data;

        if (result.tokenTransport === TokenTransport.COOKIE) {
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000,
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            return sendResponse(res, {
                ...result,
                data: {
                    user: result.data.user,
                },
            });
        }

        return sendResponse(res, result);
    },
);

export const getCurrentUserController = asyncHandler(
    async (req: Request, res: Response) => {
        const authReq = req as AuthenticatedRequest;

        const result = await authService.getCurrentUser(authReq.user.sub);

        return sendResponse(res, result);
    },
);

export const logoutController = asyncHandler(
    async (req: Request, res: Response) => {
        const authReq = req as AuthenticatedRequest;
        const result = await authService.logout(authReq.user.sessionId);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return sendResponse(res, result);
    },
);

export const logoutAllController = asyncHandler(
    async (req: Request, res: Response) => {
        const authReq = req as AuthenticatedRequest;
        const result = await authService.logoutAll(authReq.user.sub);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return sendResponse(res, result);
    },
);

export const refreshTokenController = asyncHandler(
    async (req: Request, res: Response) => {
        const refreshToken =
            req.cookies?.refreshToken ?? req.body?.refreshToken;

        if (!refreshToken) {
            throw APIError.unauthorized('Refresh token is required.');
        }

        const result = await authService.refreshAccessToken(refreshToken);

        /**
         * Cookie client
         */
        if (result.tokenTransport === TokenTransport.COOKIE) {
            res.cookie('accessToken', result.data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000,
            });

            res.cookie('refreshToken', result.data.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            return sendResponse(res, {
                ...result,
                data: null,
            });
        }

        /**
         * Body client
         */
        return sendResponse(res, result);
    },
);

export const forgotPasswordController = asyncHandler(
    async (req: Request, res: Response) => {
        const requestData: ForgotPasswordDTO = req.body;
        const result = await authService.forgotPassword(requestData);

        return sendResponse(res, result);
    },
);

export const resetPasswordController = asyncHandler(
    async (req: Request, res: Response) => {
        const requestData: ResetPasswordDTO = req.body;
        const result = await authService.resetPassword(requestData);
        return sendResponse(res, result);
    },
);

export const updateProfileController = asyncHandler(
    async (req: Request, res: Response) => {
        const authReq = req as AuthenticatedRequest;
        const requestData: UpdateProfileDTO = req.body;
        const result = await authService.updateProfile(
            authReq.user.sub,
            requestData,
        );

        return sendResponse(res, result);
    },
);
