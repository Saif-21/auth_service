import { Request, Response } from 'express';
import { roleService } from '../service/role.service';
import { asyncHandler } from '@/core/errors/async-handler';
import { RoleDTO } from '../dto/role.dto';
import { sendResponse } from '@/core/response';

// Create Role.
export const createRole = asyncHandler(async (req: Request, res: Response) => {
    const requestData: RoleDTO = req.body;
    const result = await roleService.createRole(requestData);
    return sendResponse(res, result);
});

// Get All Roles
export const getAllRoles = asyncHandler(async (req: Request, res: Response) => {
    const result = await roleService.getAllRoles();
     return sendResponse(res, result);
});

// Get Role By Id
export const getRoleById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const result = await roleService.getRoleById(req.params.id);
    return sendResponse(res, result);
});

// Update Role
export const updateRole = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const {id} = req.params;
    const requestData: RoleDTO = req.body;
    const result = await roleService.updateRole(id, requestData);
    return sendResponse(res, result);
});

// Delete Role
export const deleteRole = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const {id} = req.params;
    const result = await roleService.deleteRole(id);
    return sendResponse(res, result);
});