import { Schema, model } from 'mongoose';

import { IPermissionDocument } from '../types/permission.types';

const permissionSchema = new Schema<IPermissionDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            maxlength: 100,
        },
        slug: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            maxlength: 100,
        },
        module: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        action: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: null,
        },
        isSystem: {
            type: Boolean,
            default: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

// Indexes
permissionSchema.index({ module: 1 });
permissionSchema.index({ action: 1 });
permissionSchema.index({ isActive: 1 });

export const PermissionModel = model<IPermissionDocument>(
    'Permission',
    permissionSchema,
);
