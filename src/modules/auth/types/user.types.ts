import { HydratedDocument, Types } from 'mongoose';

export interface IUser {
    _id?: Types.ObjectId;
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
}
