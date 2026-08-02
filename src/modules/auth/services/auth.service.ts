import APIError from '@/core/errors/api-error';
import { authRepository } from '../repository/auth.repository';
import { RegisterDTO } from '../dto/register.dto';
import clientService from '@/modules/client/service/client.service';
import { roleRepository } from '@/modules/Role/repository/role.repository';

class AuthService {
    async registerUser(data: RegisterDTO) {
        // Validate Client
        const client = await clientService.validateClient(data.clientId);

        // Normalize email
        data.email = data.email.trim().toLowerCase();

        // Check if user already exists.
        const existingUser = await authRepository.findUserByEmailOrPhone(
            data.email,
            data.phone,
        );

        if (existingUser) {
            if (existingUser.email === data.email) {
                throw APIError.conflict('User with this email already exists');
            }

            if (existingUser.phone === data.phone) {
                throw APIError.conflict(
                    'User with this phone number already exists',
                );
            }
        }

        const defaultRole = await roleRepository.findDefaultRole();
        if (!defaultRole) {
            throw APIError.internal('Default role is not configured');
        }

        const user = await authRepository.createUser({
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
            role: defaultRole._id,
        });

       

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
