import { Types } from 'mongoose';

export interface RoleDTO {
    name: string;
    slug: string;
    description?: string;
    permissions?: Types.ObjectId[];
    isDefault?: boolean;
    isSystem?: boolean;
    isActive?: boolean;
}
