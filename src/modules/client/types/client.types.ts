import { Document } from 'mongoose';

export enum ClientPlatform {
    WEB = 'web',
    MOBILE = 'mobile',
    API = 'api',
}

export enum TokenTransport {
    COOKIE = 'cookie',
    BODY = 'body',
}

export interface IClient {
    name: string;

    clientId: string;

    clientSecret: string;

    platform: ClientPlatform;

    tokenTransport: TokenTransport;

    allowedOrigins: string[];

    isActive: boolean;
}

export interface IClientDocument extends IClient, Document {
    createdAt: Date;
    updatedAt: Date;
}
