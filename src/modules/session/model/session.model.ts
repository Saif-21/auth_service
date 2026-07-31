import mongoose, { Schema, model } from 'mongoose';
import { ISessionDocument, SessionPlatform } from '../types/session.types';

const SessionSchema = new Schema<ISessionDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        clientId: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
            index: true,
        },
        refreshTokenHash: {
            type: String,
            required: true,
            index: true,
        },
        deviceId: {
            type: String,
            default: null,
        },
        deviceName: {
            type: String,
            default: null,
        },
        platform: {
            type: Number,
            enum: Object.values(SessionPlatform),
            required: true,
            index: true,
        },
        browser: {
            type: String,
            default: null,
        },
        os: {
            type: String,
            default: null,
        },
        ipAddress: {
            type: String,
            required: true,
        },
        userAgent: {
            type: String,
            default: null,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },
        lastUsedAt: {
            type: Date,
            default: Date.now,
        },
        isRevoked: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

SessionSchema.index({
    userId: 1,
    isRevoked: 1,
});

SessionSchema.index({
    refreshTokenHash: 1,
    isRevoked: 1,
});

SessionSchema.index({
    userId: 1,
    clientId: 1,
});

SessionSchema.index({
    expiresAt: 1,
});


SessionSchema.index(
    { expiresAt: 1 },
    {
        expireAfterSeconds: 0,
    },
);

export const SessionModel = model<ISessionDocument>('Session', SessionSchema);
