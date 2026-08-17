import { Types } from 'mongoose';
import APIError from '@/core/errors/api-error';

import { roleRepository } from '../repository/role.repository';
// import { permissionRepository } from '@/modules/permission/repository/permission.repository';

import { IRole, IRoleDocument } from '../types/role.types';
import { RoleDTO } from '../dto/role.dto';
import { authRepository } from '@/modules/auth/repository/auth.repository';

class RoleService {
    // Create Role
    async createRole(payload: RoleDTO) {
        const existingName = await roleRepository.findByName(payload.name);

        if (existingName) {
            throw APIError.conflict('Role name already exists.');
        }

        const existingSlug = await roleRepository.findBySlug(payload.slug);

        if (existingSlug) {
            throw APIError.conflict('Role slug already exists.');
        }

        const role = await roleRepository.create(payload);

        return {
            success: true,
            statusCode: 201,
            message: 'Role created successfully.',
            data: {
                id: role._id,
            },
        };
    }

    /**
     * Get All Roles
     */
    async getAllRoles() {
        const roles = await roleRepository.findAll();

        return {
            success: true,
            statusCode: 200,
            message: 'All roles fetched successfully.',
            data: roles,
        };
    }

    /**
     * Get Role By Id
     */
    async getRoleById(id: string) {
        const role = await roleRepository.findById(id);

        if (!role) {
            throw APIError.notFound('Role not found.');
        }

        return {
            success: true,
            statusCode: 200,
            message: 'Role fetched successfully.',
            data: role,
        };
    }

    // /**
    //  * Get Role By Slug
    //  */
    async getRoleBySlug(slug: string) {
        const role = await roleRepository.findBySlug(slug);

        if (!role) {
            throw APIError.notFound('Role not found.');
        }

        return role;
    }

    // /**
    //  * Update Role
    //  */
    async updateRole(id: string, payload: Partial<RoleDTO>) {
        const role = await roleRepository.findById(id);

        if (!role) {
            throw APIError.notFound('Role not found.');
        }

        if (payload.name && payload.name !== role.name) {
            const exists = await roleRepository.findByName(payload.name);

            if (exists) {
                throw APIError.conflict('Role name already exists.');
            }
        }

        if (payload.slug && payload.slug !== role.slug) {
            const exists = await roleRepository.findBySlug(payload.slug);

            if (exists) {
                throw APIError.conflict('Role slug already exists.');
            }
        }

        const updatedrole = await roleRepository.update(id, payload);

        return {
            success: true,
            statusCode: 200,
            message: 'Role updated successfully.',
            data: updatedrole,
        };
    }

    /**
     * Delete Role
     */
    async deleteRole(id: string) {
        const role = await roleRepository.findById(id);

        if (!role) {
            throw APIError.notFound('Role not found.');
        }

        if (role.isSystem) {
            throw APIError.badRequest('System role cannot be deleted.');
        }

        if (role.isDefault) {
            throw APIError.badRequest('Default role cannot be deleted.');
        }

        // Check whether any user is using this role.
        const user = await authRepository.findUserByRole(id);
        if (user && user.length > 0) {
            throw APIError.badRequest('Role is assigned to users. Cannot delete.');
        }
        
        await roleRepository.delete(id);

        return {
            success: true,
            statusCode: 200,
            message: 'Role deleted successfully.',
            data: {
                id,
            },
        };
    }
}

export const roleService = new RoleService();
