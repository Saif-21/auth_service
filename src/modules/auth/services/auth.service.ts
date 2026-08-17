import APIError from '@/core/errors/api-error';
import { authRepository } from '../repository/auth.repository';
import { RegisterDTO } from '../dto/register.dto';
import clientService from '@/modules/client/services/client.service';
import { roleRepository } from '@/modules/Role/repository/role.repository';
import jwtUtil from '@/utils/jwt.util';
import sessionService from '@/modules/session/service/session.service';
import { LoginDTO } from '../dto/login.dto';
import { UpdateProfileDTO } from '../dto/update-profile.dto';
import { ForgotPasswordDTO } from '../dto/forgot-password.dto';
import { PasswordResetModel } from '../models/password-reset.model';
import { ResetPasswordDTO } from '../dto/reset-password.dto';

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

    async loginUser(data: LoginDTO) {
        const client = await clientService.validateClient(data.clientId);
        data.email = data.email.trim().toLowerCase();
        const user = await authRepository.findUserByEmail(data.email);

        if (!user) {
            throw APIError.unauthorized('Invalid email or password.');
        }

        if (!user.isActive) {
            throw APIError.forbidden('Your account is inactive.');
        }

        const passwordValid = await user.comparePassword(data.password);

        if (!passwordValid) {
            throw APIError.unauthorized('Invalid email or password.');
        }

        const role = user.role;
        if (!role) {
            throw APIError.internal('User role is not configured.');
        }

        const permissions = role.permissions.map(
            (permission: any) => permission.slug,
        );
        const refreshToken = jwtUtil.generateRefreshToken();
        const refreshTokenHash = jwtUtil.hashRefreshToken(refreshToken);

        const refreshTokenExpiresAt = new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
        );

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

        const accessToken = jwtUtil.generateAccessToken({
            sub: user._id.toString(),
            sessionId: session._id.toString(),
            role: role.slug,
            permissions,
            clientId: client.clientId,
        });

        return {
            success: true,
            statusCode: 200,
            message: 'Login successful.',
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

    async getCurrentUser(userId: string) {
        const user = await authRepository.findById(userId);

        if (!user) {
            throw APIError.notFound('User not found.');
        }

        return {
            success: true,
            statusCode: 200,
            message: 'User fetched successfully.',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    avatar: user.avatar,
                    isActive: user.isActive,
                    isEmailVerified: user.isEmailVerified,
                    role: user.role,
                },
            },
        };
    }

    async logout(sessionId: string) {
        const session = await sessionService.findById(sessionId);
        if (!session) {
            throw APIError.notFound('Session not found.');
        }
        await sessionService.revokeSession(sessionId);
        return {
            success: true,
            statusCode: 200,
            message: 'Logged out successfully.',
            data: null,
        };
    }

    async logoutAll(userId: string) {
        await sessionService.revokeAllSessions(userId);
        return {
            success: true,
            statusCode: 200,
            message: 'Logged out from all devices successfully.',
            data: null,
        };
    }

    async refreshAccessToken(refreshToken: string) {
        // 1. Validate old refresh token
        const session = await sessionService.validateSession(refreshToken);

        if (!session) {
            throw APIError.unauthorized('Invalid or expired refresh token.');
        }

        // 2. Validate Client
        const client = await clientService.getByClientId(
            session.clientId.toString(),
        );

        if (!client || !client.isActive) {
            throw APIError.unauthorized('Client is invalid or inactive.');
        }

        // 3. Get User
        const user = await authRepository.findById(session.userId.toString());
        if (!user) {
            throw APIError.unauthorized('User not found.');
        }

        if (!user.isActive) {
            throw APIError.forbidden('Your account is inactive.');
        }

        // 4. Get populated User
        const userWithRole = await authRepository.findUserByEmail(user.email);
        if (!userWithRole) {
            throw APIError.internal('User role is not configured.');
        }

        const role = userWithRole.role;
        const permissions = role.permissions.map(
            (permission) => permission.slug,
        );

        // 5. Rotate Refresh Token
        const rotated = await sessionService.rotateRefreshToken(
            session._id,
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        );

        // 6. Generate New Access Token
        const accessToken = jwtUtil.generateAccessToken({
            sub: user._id.toString(),
            sessionId: session._id.toString(),
            role: role.slug,
            permissions,
            clientId: client.clientId,
        });

        // 7. Update Session Last Used
        await sessionService.updateLastUsedAt(session._id);

        return {
            success: true,
            statusCode: 200,
            message: 'Token refreshed successfully.',
            data: {
                accessToken,
                refreshToken: rotated.refreshToken,
            },
            tokenTransport: client.tokenTransport,
        };
    }

    async updateProfile(userId: string, data: UpdateProfileDTO) {
        const user = await authRepository.findById(userId);

        if (!user) {
            throw APIError.notFound('User not found.');
        }

        const updatedUser = await authRepository.update(userId, {
            name: data.name,
            phone: data.phone,
            avatar: data.avatar,
        });

        if (!updatedUser) {
            throw APIError.internal('Unable to update profile.');
        }

        return {
            success: true,
            statusCode: 200,
            message: 'Profile updated successfully.',
            data: {
                user: {
                    id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    avatar: updatedUser.avatar,
                },
            },
        };
    }

    async forgotPassword(data: ForgotPasswordDTO) {
        data.email = data.email.trim().toLowerCase();
        const user = await authRepository.findUserByEmail(data.email);
        /**
         * IMPORTANT:
         *
         * Don't tell the user whether the
         * email exists.
         */
        if (!user) {
            return {
                success: true,
                statusCode: 200,
                message:
                    'If an account exists with this email, a password reset link will be sent.',
                data: null,
            };
        }

        const token = jwtUtil.generatePasswordResetToken();
        const tokenHash = jwtUtil.hashPasswordResetToken(token);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await PasswordResetModel.deleteMany({
            userId: user._id,
        });

        await PasswordResetModel.create({
            userId: user._id,
            tokenHash,
            expiresAt,
            used: false,
        });

        /**
         * TODO:
         *
         * Send email here.
         *
         * Example:
         *
         * https://your-frontend.com/reset-password?token=...
         */

        return {
            success: true,
            statusCode: 200,
            message:
                'If an account exists with this email, a password reset link will be sent.',
            data: null,
        };
    }

    async resetPassword(data: ResetPasswordDTO) {
        const tokenHash = jwtUtil.hashPasswordResetToken(data.token);
        const resetRequest = await PasswordResetModel.findOne({
            tokenHash,
            used: false,
            expiresAt: {
                $gt: new Date(),
            },
        });

        if (!resetRequest) {
            throw APIError.badRequest(
                'Invalid or expired password reset token.',
            );
        }

        // Find User
        const user = await authRepository.findById(
            resetRequest.userId.toString(),
        );

        if (!user) {
            throw APIError.notFound('User not found.');
        }

        /**
         * Update Password
         *
         * Using findByIdAndUpdate would NOT
         * trigger your save middleware.
         *
         * So assign the password and save.
         */
        user.password = data.password;
        await user.save();

        // Mark token as used
        resetRequest.used = true;
        await resetRequest.save();

        /**
         * IMPORTANT:
         *
         * Revoke all existing sessions.
         *
         * This logs the user out from
         * all devices after password reset.
         */
        await sessionService.revokeAllSessions(user._id);

        return {
            success: true,
            statusCode: 200,
            message: 'Password reset successfully.',
            data: null,
        };
    }
}

export const authService = new AuthService();
