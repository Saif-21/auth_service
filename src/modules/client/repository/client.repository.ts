import { Types } from 'mongoose';

import { ClientModel } from '../model/client.model';
import { IClient, IClientDocument } from '../types/client.types';
import { ClientDTO } from '../dto/client.dto';

class ClientRepository {
    /**
     * Create Client
     */
    async create(payload: ClientDTO) {
        return await ClientModel.create(payload);
    }

    /**
     * Get All Clients
     */
    async findAll() {
        return await ClientModel.find().sort({
            createdAt: -1,
        });
    }

    /**
     * Find Client By Mongo Id
     */
    async findById(
        id: string | Types.ObjectId,
    ) {
        return await ClientModel.findById(id);
    }

    /**
     * Find Client By Client Id
     */
    async findByClientId(clientId: string) {
        return await ClientModel.findOne({
            clientId,
        });
    }

    /**
     * Find Active Client
     */
    async findActiveClient(clientId: string) {
        return await ClientModel.findOne({
            clientId,
            isActive: true,
        });
    }

    /**
     * Update Client
     */
    async update(
        id: string | Types.ObjectId,
        payload: Partial<ClientDTO>,
    ) {
        return await ClientModel.findByIdAndUpdate(id, payload, {
            returnDocument: 'after',
            runValidators: true,
        });
    }

    /**
     * Delete Client
     */
    async delete(id: string | Types.ObjectId) {
        return await ClientModel.findByIdAndDelete(id);         
    }
}

export default new ClientRepository();
