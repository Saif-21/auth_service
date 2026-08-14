import { asyncHandler } from '@/core/errors/async-handler';
import { sendResponse } from '@/core/response';
import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { RegisterDTO } from '../dto/register.dto';
import APIError from '@/core/errors/api-error';
import { TokenTransport } from '@/modules/client/types/client.types';

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
