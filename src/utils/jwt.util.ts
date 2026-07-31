import crypto from 'crypto';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export interface AccessTokenPayload {
    sub: string;
    sessionId: string;
    role: string;
    permissions: string[];
    clientId: string;
}

class JwtUtil {
    /**
     * Generate Access Token
     */
    generateAccessToken(payload: AccessTokenPayload): string {
        return jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET as string,
            {
                expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
                issuer: process.env.JWT_ISSUER,
                audience: process.env.JWT_AUDIENCE,
            } as SignOptions,
        );
    }

    /**
     * Verify Access Token
     */
    verifyAccessToken(token: string): AccessTokenPayload {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string, {
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWT_AUDIENCE,
        }) as AccessTokenPayload;
    }

    /**
     * Decode Token
     */
    decode(token: string): JwtPayload | string | null {
        return jwt.decode(token);
    }

    /**
     * Generate Refresh Token
     */
    generateRefreshToken(): string {
        return crypto.randomBytes(64).toString('hex');
    }

    /**
     * Hash Refresh Token
     */
    hashRefreshToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}

export default new JwtUtil();
