import clientRepository from '../repository/client.repository';

import { IClient, IClientDocument } from '../types/client.types';

// Replace with your own error class
import APIError from '../../../core/errors/api-error';

class ClientService {
    /**
     * Validate Client
     */
    async validateClient(clientId: string): Promise<IClientDocument> {
        if (!clientId) {
            throw APIError.badRequest('Client Id is required.');
        }

        const client = await clientRepository.findByClientId(clientId);

        if (!client) {
            throw APIError.unauthorized('Invalid client.');
        }

        if (!client.isActive) {
            throw APIError.forbidden('Client is inactive.');
        }

        return client;
    }

    /**
     * Get Client By Client Id
     */
    async getByClientId(clientId: string): Promise<IClientDocument | null> {
        return clientRepository.findByClientId(clientId);
    }

    /**
     * Get Client By Id
     */
    async getById(id: string): Promise<IClientDocument | null> {
        return clientRepository.findById(id);
    }

    /**
     * Create Client
     */
    async createClient(payload: IClient): Promise<IClientDocument> {
        const exists = await clientRepository.findByClientId(payload.clientId);

        if (exists) {
            throw APIError.conflict('Client already exists.');
        }

        return clientRepository.create(payload);
    }

    /**
     * Update Client
     */
    async updateClient(
        id: string,
        payload: Partial<IClient>,
    ): Promise<IClientDocument> {
        const client = await clientRepository.findById(id);

        if (!client) {
            throw APIError.notFound('Client not found.');
        }

        return clientRepository.update(id, payload) as Promise<IClientDocument>;
    }

    /**
     * Activate Client
     */
    async activateClient(id: string): Promise<void> {
        const client = await clientRepository.findById(id);

        if (!client) {
            throw APIError.notFound('Client not found.');
        }

        await clientRepository.activate(id);
    }

    /**
     * Deactivate Client
     */
    async deactivateClient(id: string): Promise<void> {
        const client = await clientRepository.findById(id);

        if (!client) {
            throw APIError.notFound('Client not found.');
        }

        await clientRepository.deactivate(id);
    }

    /**
     * Get All Clients
     */
    async getAllClients() {
        return clientRepository.findAll();
    }
}

export default new ClientService();
