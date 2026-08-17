import clientRepository from '../repository/client.repository';

import { IClient, IClientDocument } from '../types/client.types';

// Replace with your own error class
import APIError from '../../../core/errors/api-error';
import { ClientDTO } from '../dto/client.dto';

class ClientService {
    /**
     * Create Client
     */
    async createClient(payload: ClientDTO) {
        const exists = await clientRepository.findByClientId(payload.clientId);

        if (exists) {
            throw APIError.conflict('Client already exists.');
        }

        const client = await clientRepository.create(payload);

        return {
            success: true,
            statusCode: 201,
            message: 'Client created successfully.',
            data: {
                id: client._id,
                name: client.name,
                clientId: client.clientId,
                platform: client.platform,
                tokenTransport: client.tokenTransport,
                allowedOrigins: client.allowedOrigins,
                isActive: client.isActive,
            },
        };
    }

    /**
     * Get All Clients
     */
    async getAllClients() {
        const result = await clientRepository.findAll();

        return {
            success: true,
            statusCode: 200,
            message: 'Clients fetched successfully.',
            data: result,
        };
    }

    /**
     * Get Client By Id
     */
    async getById(id: string) {
        const client = await clientRepository.findById(id);

        return {
            success: true,
            statusCode: 200,
            message: 'Client fetched successfully.',
            data: client,
        };
    }

    /**
     * Update Client
     */
    async updateClient(id: string, payload: Partial<ClientDTO>) {
        const client = await clientRepository.findById(id);

        if (!client) {
            throw APIError.notFound('Client not found.');
        }

        const result = await clientRepository.update(id, payload);

        return {
            success: true,
            statusCode: 200,
            message: 'Client updated successfully.',
            data: result,
        };
    }

    async deleteClient(id: string) {
        const client = await clientRepository.findById(id);

        if (!client) {
            throw APIError.notFound('Client not found.');
        }

        const result = await clientRepository.delete(id);

        return {
            success: true,
            statusCode: 200,
            message: 'Client deleted successfully.',
            data: result,
        };
    }

    /**
     * Validate Client
     */
    async validateClient(clientId: string) {
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
    async getByClientId(clientId: string) {
        return clientRepository.findByClientId(clientId);
    }
}

export default new ClientService();
