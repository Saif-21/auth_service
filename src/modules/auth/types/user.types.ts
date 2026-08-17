import { Types } from 'mongoose';

import { IRoleWithPermissions } from '@/modules/Role/types/role.types';

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    password: string;
    role: Types.ObjectId;
    isActive?: boolean;
    isEmailVerified?: boolean;
    permissions?: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword(password: string): Promise<boolean>;
}

export interface IUserWithPopulatedRole extends Omit<IUser, 'role'> {
    role: IRoleWithPermissions;
}
