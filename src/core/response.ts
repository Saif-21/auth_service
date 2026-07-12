import { Response } from 'express';

interface IResponse {
    success: boolean;
    statusCode: number;
    message?: string;
    data?: any;
    meta?: any;
    facets?: any;
}

export const sendResponse = (res: Response, result: IResponse) => {
    const response: any = {
        success: result.success,
    };

    if (result.message) response.message = result.message;
    if (result.data) response.data = result.data;
    if (result.meta) response.meta = result.meta;
    if (result.facets) response.facets = result.facets;

    return res.status(result.statusCode).json(response);
};
