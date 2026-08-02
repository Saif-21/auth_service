import { Types } from 'mongoose';
import APIError from '@/core/errors/api-error';
import { permissionRepository } from '../repository/permission.repository';
import { PermissionDTO } from '../dto/permission.dto';

class PermissionService {
    // Create Permission
    async createPermission(payload: PermissionDTO) {
        const existingName = await permissionRepository.findByName(
            payload.name,
        );

        if (existingName) {
            throw APIError.conflict('Permission name already exists.');
        }

        const existingSlug = await permissionRepository.findBySlug(
            payload.slug,
        );

        if (existingSlug) {
            throw APIError.conflict('Permission slug already exists.');
        }

        const [module, action] = payload.slug.split(':');

        const permission = await permissionRepository.create({
            ...payload,
            module,
            action,
        });

        return {
            success: true,
            statusCode: 201,
            message: 'Permission created successfully.',
            data: {
                id: permission._id,
            },
        };
    }

    /**
     * Get All Permissions
     */
    async getAllPermissions() {
        const permissions = await permissionRepository.findAll();

        return {
            success: true,
            statusCode: 200,
            message: 'All permissions fetched successfully.',
            data: permissions,
        };
    }

    /**
     * Get Permission By Id
     */
    async getPermissionById(id: string) {
        const permission = await permissionRepository.findById(id);

        if (!permission) {
            throw APIError.notFound('Permission not found.');
        }

        return {
            success: true,
            statusCode: 200,
            message: 'Permission fetched successfully.',
            data: permission,
        };
    }

    /**
     * Update Permission
     */
    async updatePermission(id: string, payload: Partial<PermissionDTO>) {
        const permission = await permissionRepository.findById(id);

        if (!permission) {
            throw APIError.notFound('Permission not found.');
        }

        if (payload.name && payload.name !== permission.name) {
            const existingName = await permissionRepository.findByName(
                payload.name,
            );

            if (existingName) {
                throw APIError.conflict('Permission name already exists.');
            }
        }

        if (payload.slug && payload.slug !== permission.slug) {
            const existingSlug = await permissionRepository.findBySlug(
                payload.slug,
            );

            if (existingSlug) {
                throw APIError.conflict('Permission slug already exists.');
            }
        }

        const updatedPermission = await permissionRepository.update(
            id,
            payload,
        );

        return {
            success: true,
            statusCode: 200,
            message: 'Permission updated successfully.',
            data: updatedPermission,
        };
    }

    /**
     * Delete Permission
     */
    async deletePermission(id: string) {
        const permission = await permissionRepository.findById(id);

        if (!permission) {
            throw APIError.notFound('Permission not found.');
        }

        await permissionRepository.delete(id);

        return {
            success: true,
            statusCode: 200,
            message: 'Permission deleted successfully.',
        };
    }
}

export const permissionService = new PermissionService();
