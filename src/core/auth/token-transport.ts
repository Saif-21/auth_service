import { Response } from 'express';
interface TokenPayload {
    accessToken: string;
    refreshToken: string;
}

export function sendTokens(
    res: Response,
    tokens: TokenPayload,
    transport: 'cookie' | 'body',
) {
    if (transport === 'cookie') {
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return null;
    }

    return tokens;
}
