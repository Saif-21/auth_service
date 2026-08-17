import { Schema, model, Types } from 'mongoose';

export interface IPasswordReset {
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    used: boolean;
}

const passwordResetSchema = new Schema<IPasswordReset>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        tokenHash: {
            type: String,
            required: true,
            unique: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        used: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

/**
 * Automatically remove expired reset tokens.
 */
passwordResetSchema.index(
    { expiresAt: 1 },
    {
        expireAfterSeconds: 0,
    },
);

export const PasswordResetModel = model<IPasswordReset>(
    'PasswordReset',
    passwordResetSchema,
);
