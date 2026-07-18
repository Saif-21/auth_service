import APIError from "@/core/errors/api-error";
import { authRepository } from "../repository/auth.repository";

class AuthService {
    async registerUser(data: any) {
        const isEmailExists = await authRepository.findUserByEmail(data.email);

        if (isEmailExists) {
            throw new APIError(400, "User with this email already exists");
        }

        
        return {
            success: true,
            statusCode: 201,
            message: "User registered successfully",
            data: {
                Name: 'John Doe',
            }
        }
    }
}

export const authService = new AuthService();
