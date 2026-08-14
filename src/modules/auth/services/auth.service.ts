import APIError from '@/core/errors/api-error';
import { authRepository } from '../repository/auth.repository';
import { RegisterDTO } from '../dto/register.dto';
import clientService from '@/modules/client/services/client.service';
import { roleRepository } from '@/modules/Role/repository/role.repository';
import jwtUtil from '@/utils/jwt.util';
import sessionService from '@/modules/session/service/session.service';

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

        // Create User.
        const user = await authRepository.createUser({
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
            role: defaultRole._id,
        });

        // Create refresh token
        const refreshToken = jwtUtil.generateRefreshToken();
        // Only HashedRefresh token saved in session.
        const refreshTokenHash = jwtUtil.hashRefreshToken(refreshToken);

        // 30 Days.
        const refreshTokenExpiresAt = new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
        );

        // Create session
        const session = await sessionService.createSession({
            userId: user._id,
            clientId: client._id,
            refreshTokenHash,
            deviceId: data.deviceId ?? null,
            deviceName: data.deviceName ?? null,
            platform: client.platform,
            browser: data.browser ?? null,
            os: data.os ?? null,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
            expiresAt: refreshTokenExpiresAt,
            lastUsedAt: new Date(),
            isRevoked: false,
        });

        const permissions = defaultRole.permissions.map(
            (permission: any) => permission.slug,
        );
        // 8. Generate access token
        const accessToken = jwtUtil.generateAccessToken({
            sub: user._id.toString(),
            sessionId: session._id.toString(),
            role: defaultRole.slug,
            permissions,
            clientId: client.clientId,
        });
        // 9. Return tokens

        return {
            success: true,
            statusCode: 201,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                },
                accessToken,
                refreshToken,
            },
            tokenTransport: client.tokenTransport,
        };
    }
}

export const authService = new AuthService();
