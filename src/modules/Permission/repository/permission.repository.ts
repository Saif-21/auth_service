import { Types } from 'mongoose';
import { PermissionDTO } from '../dto/permission.dto';
import { PermissionModel } from '../model/permission.model';
import { IPermission, IPermissionDocument } from '../types/permission.types';

class PermissionRepository {
    /**
     * Create Permission
     */
    async create(payload: PermissionDTO) {
        return PermissionModel.create(payload);
    }

    /**
     * Find Permission By Mongo Id
     */
    async findById(
        id: string | Types.ObjectId,
    ): Promise<IPermissionDocument | null> {
        return PermissionModel.findById(id);
    }

    /**
     * Find Permission By Name
     */
    async findByName(name: string): Promise<IPermissionDocument | null> {
        return PermissionModel.findOne({
            name,
        });
    }

    /**
     * Find Permission By Slug
     */
    async findBySlug(slug: string): Promise<IPermissionDocument | null> {
        return PermissionModel.findOne({
            slug,
        });
    }

    /**
     * Get All Permissions
     */
    async findAll(): Promise<IPermissionDocument[]> {
        return PermissionModel.find().sort({
            createdAt: -1,
        });
    }

    /**
     * Update Permission
     */
    async update(
        id: string | Types.ObjectId,
        payload: Partial<IPermission>,
    ): Promise<IPermissionDocument | null> {
        return PermissionModel.findByIdAndUpdate(id, payload, {
            returnDocument: 'after',
            runValidators: true,
        });
    }

    /**
     * Activate Permission
     */
    async activate(id: string | Types.ObjectId): Promise<void> {
        await PermissionModel.findByIdAndUpdate(id, {
            isActive: true,
        });
    }

    /**
     * Deactivate Permission
     */
    async deactivate(id: string | Types.ObjectId): Promise<void> {
        await PermissionModel.findByIdAndUpdate(id, {
            isActive: false,
        });
    }

    /**
     * Delete Permission
     */
    async delete(id: string | Types.ObjectId): Promise<void> {
        await PermissionModel.findByIdAndDelete(id);
    }
}

export const permissionRepository = new PermissionRepository();
