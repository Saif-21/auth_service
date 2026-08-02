import { asyncHandler } from "@/core/errors/async-handler";
import { sendResponse } from "@/core/response";
import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { RegisterDTO } from "../dto/register.dto";

export const registerController = asyncHandler(async (req: Request, res: Response) => {
    const requestData: RegisterDTO = {
        ...req.body,
        clientId: req.header('x-client-id')!,
        ipAddress: req.ip!,
        userAgent: req.header('user-agent') ?? '',
        browser: req.header('sec-ch-ua') as string,
        os: req.header('sec-ch-ua-platform') as string,
    };

    const result = await authService.registerUser(requestData);
    return sendResponse(res, result);
});