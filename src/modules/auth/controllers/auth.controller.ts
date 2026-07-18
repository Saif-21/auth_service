import { asyncHandler } from "@/core/errors/async-handler";
import { sendResponse } from "@/core/response";
import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const registerController = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.registerUser(req.body);
    return sendResponse(res, result);
});