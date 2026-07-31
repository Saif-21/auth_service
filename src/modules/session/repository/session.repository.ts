import { Types, UpdateQuery } from 'mongoose';
import { SessionModel } from '../model/session.model';
import { ISession, ISessionDocument } from '../types/session.types';

class SessionRepository {
    /**
     * Create a new session
     */
    async create(payload: ISession): Promise<ISessionDocument> {
        return SessionModel.create(payload);
    }

    /**
     * Find session by ID
     */
    async findById(
        sessionId: string | Types.ObjectId,
    ): Promise<ISessionDocument | null> {
        return SessionModel.findById(sessionId);
    }

    /**
     * Find active session by refresh token hash
     */
    async findByRefreshTokenHash(
        refreshTokenHash: string,
    ): Promise<ISessionDocument | null> {
        return SessionModel.findOne({
            refreshTokenHash,
            isRevoked: false,
            expiresAt: { $gt: new Date() },
        });
    }

    /**
     * Get all active sessions of a user
     */
    async findActiveSessionsByUser(
        userId: string | Types.ObjectId,
    ): Promise<ISessionDocument[]> {
        return SessionModel.find({
            userId,
            isRevoked: false,
            expiresAt: { $gt: new Date() },
        }).sort({
            lastUsedAt: -1,
        });
    }

    /**
     * Update refresh token during rotation
     */
    async updateRefreshToken(
        sessionId: string | Types.ObjectId,
        refreshTokenHash: string,
        expiresAt: Date,
    ): Promise<ISessionDocument | null> {
        return SessionModel.findByIdAndUpdate(
            sessionId,
            {
                refreshTokenHash,
                expiresAt,
                lastUsedAt: new Date(),
            },
            {
                new: true,
            },
        );
    }

    /**
     * Update last activity
     */
    async updateLastUsedAt(sessionId: string | Types.ObjectId): Promise<void> {
        await SessionModel.findByIdAndUpdate(sessionId, {
            lastUsedAt: new Date(),
        });
    }

    /**
     * Revoke a session
     */
    async revokeSession(sessionId: string | Types.ObjectId): Promise<void> {
        await SessionModel.findByIdAndUpdate(sessionId, {
            isRevoked: true,
        });
    }

    /**
     * Revoke all sessions of a user
     */
    async revokeAllSessions(userId: string | Types.ObjectId): Promise<void> {
        await SessionModel.updateMany(
            {
                userId,
                isRevoked: false,
            },
            {
                isRevoked: true,
            },
        );
    }

    /**
     * Delete expired sessions
     * (Normally handled by MongoDB TTL)
     */
    async deleteExpiredSessions(): Promise<void> {
        await SessionModel.deleteMany({
            expiresAt: {
                $lte: new Date(),
            },
        });
    }

    /**
     * Generic findOne
     */
    async findOne(
        filter: Partial<ISessionDocument>,
    ): Promise<ISessionDocument | null> {
        return SessionModel.findOne(filter);
    }

    /**
     * Generic update
     */
    async update(
        filter: Partial<ISessionDocument>,
        update: Partial<ISessionDocument>,
    ): Promise<ISessionDocument | null> {
        return SessionModel.findOneAndUpdate(filter, update, {
            new: true,
        });
    }

    /**
     * Generic delete
     */
    async delete(filter: Partial<ISessionDocument>): Promise<void> {
        await SessionModel.deleteMany(filter);
    }
}

export default new SessionRepository();
