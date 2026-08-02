import { Document } from 'mongoose';

export interface IPermission {
    name: string;
    slug: string;
    module: string;
    action: string;
    description?: string;
    isSystem: boolean;
    isActive: boolean;
}

export interface IPermissionDocument extends IPermission, Document {
    createdAt: Date;
    updatedAt: Date;
}
