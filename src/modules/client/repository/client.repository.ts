import { Types } from 'mongoose';

import { ClientModel } from '../model/client.model';
import { IClient, IClientDocument } from '../types/client.types';

class ClientRepository {
    /**
     * Create Client
     */
    async create(payload: IClient): Promise<IClientDocument> {
        return ClientModel.create(payload);
    }

    /**
     * Find Client By Mongo Id
     */
    async findById(
        id: string | Types.ObjectId,
    ): Promise<IClientDocument | null> {
        return ClientModel.findById(id);
    }

    /**
     * Find Client By Client Id
     */
    async findByClientId(clientId: string): Promise<IClientDocument | null> {
        return ClientModel.findOne({
            clientId,
        });
    }

    /**
     * Find Active Client
     */
    async findActiveClient(clientId: string): Promise<IClientDocument | null> {
        return ClientModel.findOne({
            clientId,
            isActive: true,
        });
    }

    /**
     * Update Client
     */
    async update(
        id: string | Types.ObjectId,
        payload: Partial<IClient>,
    ): Promise<IClientDocument | null> {
        return ClientModel.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });
    }

    /**
     * Activate Client
     */
    async activate(id: string | Types.ObjectId): Promise<void> {
        await ClientModel.findByIdAndUpdate(id, {
            isActive: true,
        });
    }

    /**
     * Deactivate Client
     */
    async deactivate(id: string | Types.ObjectId): Promise<void> {
        await ClientModel.findByIdAndUpdate(id, {
            isActive: false,
        });
    }

    /**
     * Delete Client
     */
    async delete(id: string | Types.ObjectId): Promise<void> {
        await ClientModel.findByIdAndDelete(id);
    }

    /**
     * Get All Clients
     */
    async findAll(): Promise<IClientDocument[]> {
        return ClientModel.find().sort({
            createdAt: -1,
        });
    }
}

export default new ClientRepository();
