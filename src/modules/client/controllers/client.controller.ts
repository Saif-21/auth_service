import { Request, Response } from 'express';
import { asyncHandler } from '@/core/errors/async-handler';
import { ClientDTO } from '../dto/client.dto';
import { sendResponse } from '@/core/response';
import clientService from '../services/client.service';

export const createClient = asyncHandler(
    async (req: Request, res: Response) => {
        const requestData: ClientDTO = req.body;
        const result = await clientService.createClient(requestData);
        return sendResponse(res, result);
    },
);

export const getAllClients = asyncHandler(
    async (req: Request, res: Response) => {
        const result = await clientService.getAllClients();
        return sendResponse(res, result);
    },
);

export const getClientById = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
        const result = await clientService.getById(req.params.id);
        return sendResponse(res, result);
    },
);

export const updateClient = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
        const requestData: Partial<ClientDTO> = req.body;
        const result = await clientService.updateClient(
            req.params.id,
            requestData,
        );
        return sendResponse(res, result);
    },
);

export const deleteClient = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
        const result = await clientService.deleteClient(req.params.id);
        return sendResponse(res, result);
    },
);
