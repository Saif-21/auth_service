import {
    HydratedDocument,
    Types,
} from 'mongoose';

import {
    IPermissionDocument,
} from '@/modules/Permission/types/permission.types';

export interface IRole {
    _id?: Types.ObjectId;

    name: string;

    slug: string;

    description?: string | null;

    permissions: Types.ObjectId[];

    isDefault: boolean;

    isSystem: boolean;

    isActive: boolean;

    createdAt?: Date;

    updatedAt?: Date;
}

export type IRoleDocument =
    HydratedDocument<IRole>;

export interface IRoleWithPermissions
    extends Omit<IRole, 'permissions'> {

    permissions: IPermissionDocument[];
}