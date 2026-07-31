import {
    SESSION_PLATFORM_API,
    SESSION_PLATFORM_DESKTOP,
    SESSION_PLATFORM_MOBILE,
    SESSION_PLATFORM_WEB,
} from '@/constants/session.constant';
import { Document, Types } from 'mongoose';

export enum SessionPlatform {
    WEB = SESSION_PLATFORM_WEB,
    MOBILE = SESSION_PLATFORM_MOBILE,
    DESKTOP = SESSION_PLATFORM_DESKTOP,
    API = SESSION_PLATFORM_API,
}

export interface ISession {
    userId: Types.ObjectId;
    clientId: Types.ObjectId;
    refreshTokenHash: string;
    deviceId?: string;
    deviceName?: string;
    platform: SessionPlatform;
    browser?: string;
    os?: string;
    ipAddress: string
    userAgent?: string;
    expiresAt: Date;
    lastUsedAt: Date;
    isRevoked: boolean;
}

export interface ISessionDocument extends ISession, Document {
    createdAt: Date;
    updatedAt: Date;
}
