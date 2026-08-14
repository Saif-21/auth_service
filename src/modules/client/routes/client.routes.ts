import express from 'express';
import { createClient, deleteClient, getAllClients, getClientById, updateClient } from '../controllers/client.controller';

const ClientRouter = express.Router();

export default (app: express.Application) => {
    ClientRouter.post('/', createClient);
    ClientRouter.get('/', getAllClients);
    ClientRouter.get('/:id', getClientById);
    ClientRouter.patch('/:id', updateClient);
    ClientRouter.delete('/:id', deleteClient);

    app.use('/api/v1/client', ClientRouter);
};
