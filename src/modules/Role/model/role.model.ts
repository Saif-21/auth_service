import { model, Schema } from 'mongoose';
import { IRoleDocument } from '../types/role.types';

const roleSchema = new Schema<IRoleDocument>(
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
        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: null,
        },
        permissions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Permission',
            },
        ],
        isDefault: {
            type: Boolean,
            default: false,
        },
        isSystem: {
            type: Boolean,
            default: false,
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
roleSchema.index({ isActive: 1 });
roleSchema.index({ isDefault: 1 });

export const RoleModel = model<IRoleDocument>('Role', roleSchema);
