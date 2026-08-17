import {
    SESSION_PLATFORM_API,
    SESSION_PLATFORM_MOBILE,
    SESSION_PLATFORM_WEB,
} from '@/constants/session.constant';
import { SessionPlatform } from '@/modules/session/types/session.types';
import { Document } from 'mongoose';

export enum TokenTransport {
    COOKIE = 'cookie',
    BODY = 'body',
}

export interface IClient {
    name: string;
    clientId: string;
    clientSecret: string;
    platform: SessionPlatform;
    tokenTransport: TokenTransport;
    allowedOrigins: string[];
    isActive: boolean;
}

export interface IClientDocument extends IClient, Document {
    createdAt: Date;
    updatedAt: Date;
}
