import { Schema, model } from 'mongoose';

import {
    ClientPlatform,
    IClientDocument,
    TokenTransport,
} from '../types/client.types';

const ClientSchema = new Schema<IClientDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        clientId: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },

        clientSecret: {
            type: String,
            required: true,
            trim: true,
        },

        platform: {
            type: String,
            enum: Object.values(ClientPlatform),
            required: true,
            index: true,
        },

        tokenTransport: {
            type: String,
            enum: Object.values(TokenTransport),
            required: true,
            default: TokenTransport.BODY,
        },

        allowedOrigins: {
            type: [String],
            default: [],
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

ClientSchema.index({
    clientId: 1,
    isActive: 1,
});

export const ClientModel = model<IClientDocument>('Client', ClientSchema);
