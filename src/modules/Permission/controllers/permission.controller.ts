import { Request, Response } from 'express';
import { asyncHandler } from '@/core/errors/async-handler';
import { sendResponse } from '@/core/response';
import { PermissionDTO } from '../dto/permission.dto';
import { permissionService } from '../service/permission.service';

// Create Permission.
export const createPermission = asyncHandler(
    async (req: Request, res: Response) => {
        const requestData: PermissionDTO = req.body;
        const result = await permissionService.createPermission(requestData);
        return sendResponse(res, result);
    },
);

// Get All Permissions
export const getAllPermissions = asyncHandler(
    async (req: Request, res: Response) => {
        const result = await permissionService.getAllPermissions();
        return sendResponse(res, result);
    },
);

// Get Permission By Id
export const getPermissionById = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params;
        const result = await permissionService.getPermissionById(id);
        return sendResponse(res, result);
    },
);

// Update Permission
export const updatePermission = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params;
        const requestData: Partial<PermissionDTO> = req.body;
        const result = await permissionService.updatePermission(
            id,
            requestData,
        );
        return sendResponse(res, result);
    },
);

// Delete Permission
export const deletePermission = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params;
        const result = await permissionService.deletePermission(id);
        return sendResponse(res, result);
    },
);
