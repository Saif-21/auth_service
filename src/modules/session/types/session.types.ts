import {
    SESSION_PLATFORM_API,
    SESSION_PLATFORM_MOBILE,
    SESSION_PLATFORM_WEB,
} from '@/constants/session.constant';
import { Document, Types } from 'mongoose';

export enum SessionPlatform {
    WEB = SESSION_PLATFORM_WEB,
    MOBILE = SESSION_PLATFORM_MOBILE,
    API = SESSION_PLATFORM_API,
}

export interface ISession {
    userId: Types.ObjectId;
    clientId: Types.ObjectId;
    refreshTokenHash: string;
    deviceId?: string | null;
    deviceName?: string | null;
    platform: SessionPlatform;
    browser?: string | null;
    os?: string | null;
    ipAddress: string
    userAgent?: string | null;
    expiresAt: Date;
    lastUsedAt: Date;
    isRevoked: boolean;
}

export interface ISessionDocument extends ISession, Document {
    createdAt: Date;
    updatedAt: Date;
}
