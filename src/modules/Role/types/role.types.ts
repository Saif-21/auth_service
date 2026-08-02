import { Types } from 'mongoose';

export interface IRole {
    name: string;
    slug: string;
    description?: string;
    permissions: Types.ObjectId[];
    isDefault: boolean;
    isSystem: boolean;
    isActive: boolean;
}

export interface IRoleDocument extends IRole, Document {
    createdAt: Date;
    updatedAt: Date;
}
