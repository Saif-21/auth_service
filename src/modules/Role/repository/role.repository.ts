import { Types } from 'mongoose';

import { RoleModel } from '../model/role.model';
import { IRole, IRoleDocument } from '../types/role.types';
import { RoleDTO } from '../dto/role.dto';

class RoleRepository {
    /**
     * Create Role
     */
    async create(payload: RoleDTO) {
        return RoleModel.create(payload);
    }

    /**
     * Find Role By Mongo Id
     */
    async findById(id: string | Types.ObjectId): Promise<IRoleDocument | null> {
        return RoleModel.findById(id).populate('permissions');
    }

    /**
     * Find Role By Name
     */
    async findByName(name: string) {
        return RoleModel.findOne({
            name,
        });
    }

    /**
     * Find Role By Slug
     */
    async findBySlug(slug: string) {
        return RoleModel.findOne({
            slug,
        }).populate('permissions');
    }

    /**
     * Find Default Role
     */
    async findDefaultRole(){
        return RoleModel.findOne({
            isDefault: true,
            isActive: true,
        }).populate('permissions');
    }

    /**
     * Get All Roles
     */
    async findAll() {
        return RoleModel.find().populate('permissions').sort({
            createdAt: -1,
        });
    }

    /**
     * Update Role
     */
    async update(
        id: string | Types.ObjectId,
        payload: Partial<RoleDTO>,
    ) {
        return RoleModel.findByIdAndUpdate(id, payload, {
            returnDocument: 'after',
            runValidators: true,
        }).populate('permissions');
    }

    /**
     * Activate Role
     */
    async activate(id: string | Types.ObjectId): Promise<void> {
        await RoleModel.findByIdAndUpdate(id, {
            isActive: true,
        });
    }

    /**
     * Deactivate Role
     */
    async deactivate(id: string | Types.ObjectId): Promise<void> {
        await RoleModel.findByIdAndUpdate(id, {
            isActive: false,
        });
    }

    /**
     * Update Role Permissions
     */
    async updatePermissions(
        id: string | Types.ObjectId,
        permissions: Types.ObjectId[],
    ): Promise<IRoleDocument | null> {
        return RoleModel.findByIdAndUpdate(
            id,
            {
                permissions,
            },
            {
                returnDocument: 'after',
                runValidators: true,
            },
        ).populate('permissions');
    }

    /**
     * Delete Role
     */
    async delete(id: string | Types.ObjectId): Promise<void> {
        await RoleModel.findByIdAndDelete(id);
    }
}

export const roleRepository = new RoleRepository();
