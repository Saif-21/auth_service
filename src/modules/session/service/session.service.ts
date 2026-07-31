import crypto from 'crypto';
import { Types } from 'mongoose';

import sessionRepository from '../repository/session.repository';
import {
    ISession,
    ISessionDocument,
    SessionPlatform,
} from '../types/session.types';

class SessionService {
    async createSession(payload: ISession): Promise<ISessionDocument> {
        return sessionRepository.create(payload);
    }

    async findById(
        sessionId: string | Types.ObjectId,
    ): Promise<ISessionDocument | null> {
        return sessionRepository.findById(sessionId);
    }

    async findByRefreshToken(
        refreshToken: string,
    ): Promise<ISessionDocument | null> {
        const refreshTokenHash = this.hashRefreshToken(refreshToken);

        return sessionRepository.findByRefreshTokenHash(refreshTokenHash);
    }

    async validateSession(
        refreshToken: string,
    ): Promise<ISessionDocument | null> {
        const session = await this.findByRefreshToken(refreshToken);

        if (!session) {
            return null;
        }

        if (session.isRevoked) {
            return null;
        }

        if (session.expiresAt < new Date()) {
            return null;
        }

        return session;
    }

    async updateLastUsedAt(sessionId: string | Types.ObjectId): Promise<void> {
        await sessionRepository.updateLastUsedAt(sessionId);
    }

    hashRefreshToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    generateRefreshToken(): string {
        return crypto.randomBytes(64).toString('hex');
    }

    async rotateRefreshToken(
        sessionId: string | Types.ObjectId,
        expiresAt: Date,
    ): Promise<{
        refreshToken: string;
        refreshTokenHash: string;
    }> {
        const refreshToken = this.generateRefreshToken();

        const refreshTokenHash = this.hashRefreshToken(refreshToken);

        await sessionRepository.updateRefreshToken(
            sessionId,
            refreshTokenHash,
            expiresAt,
        );

        return {
            refreshToken,
            refreshTokenHash,
        };
    }

    /**
     * Get Active Sessions
     */
    async getActiveSessions(
        userId: string | Types.ObjectId,
    ): Promise<ISessionDocument[]> {
        return sessionRepository.findActiveSessionsByUser(userId);
    }

    /**
     * Logout Current Session
     */
    async revokeSession(sessionId: string | Types.ObjectId): Promise<void> {
        await sessionRepository.revokeSession(sessionId);
    }

    /**
     * Logout All Devices
     */
    async revokeAllSessions(userId: string | Types.ObjectId): Promise<void> {
        await sessionRepository.revokeAllSessions(userId);
    }

    /**
     * Cleanup Expired Sessions
     *
     * (Normally MongoDB TTL handles this automatically.)
     */
    async cleanupExpiredSessions(): Promise<void> {
        await sessionRepository.deleteExpiredSessions();
    }
}

export default new SessionService();
