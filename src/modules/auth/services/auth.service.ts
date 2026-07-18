import APIError from '@/core/errors/api-error';
import { authRepository } from '../repository/auth.repository';

class AuthService {
    async registerUser(data: any) {
        const existingUser = await authRepository.findUserByEmailOrPhone(
            data.email,
            data.phone,
        );

        if (existingUser) {
            if (existingUser.email === data.email || existingUser.phone === data.phone) {
                throw new APIError(400, 'User with this email or phone number already exists');
            }
        }

        return {
            success: true,
            statusCode: 201,
            message: 'User registered successfully',
            data: {
                Name: 'John Doe',
            },
        };

        return {
            success: true,
            statusCode: 201,
            message: 'User registered successfully',
            data: {
                Name: 'John Doe',
            },
        };
    }
}

export const authService = new AuthService();
