import { Response } from "express";

interface IErrorResponse {
    success: boolean;
    statusCode: number;
    message?: string;
    errors?: any;
}
export const errorResponse = (res: Response, result: IErrorResponse) => {
    const response: any = {
        success: result.success,
    };

    if (result.message) response.message = result.message;
    if (result.errors) response.errors = result.errors;

    return res.status(result.statusCode).json(response);
};
