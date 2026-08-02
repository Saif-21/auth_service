import express from 'express';
import { createPermission, deletePermission, getAllPermissions, getPermissionById, updatePermission } from '../controllers/permission.controller';

const PermissionRouter = express.Router();

export default (app: express.Application) => {
    PermissionRouter.post('/', createPermission);
    PermissionRouter.get('/', getAllPermissions);
    PermissionRouter.get('/:id', getPermissionById);
    PermissionRouter.patch('/:id', updatePermission);
    PermissionRouter.delete('/:id', deletePermission);

    app.use('/api/v1/permissions', PermissionRouter);
};
