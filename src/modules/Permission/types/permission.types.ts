import { HydratedDocument, Types } from 'mongoose';

export interface IPermission {
    _id?: Types.ObjectId;
    name: string;
    slug: string;
    action: string;
    module: string,
    resource: string;
    isSystem: boolean;
    description?: string | null;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export type IPermissionDocument = HydratedDocument<IPermission>;
