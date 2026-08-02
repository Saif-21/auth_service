import express from 'express';
import {
    createRole,
    deleteRole,
    getAllRoles,
    getRoleById,
    updateRole,
} from '../controllers/role.controller';

const RoleRouter = express.Router();

export default (app: express.Application) => {
    RoleRouter.post('/', createRole);
    RoleRouter.get('/', getAllRoles);
    RoleRouter.get('/:id', getRoleById);
    RoleRouter.patch('/:id', updateRole);
    RoleRouter.delete('/:id', deleteRole);

    app.use('/api/v1/roles', RoleRouter);
};
