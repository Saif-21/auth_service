import userModel from '../models/user.model';
import { IUser, IUserWithPopulatedRole } from '../types/user.types';
class AuthRepository {
    async findUserByEmail(
        email: string,
    ): Promise<IUserWithPopulatedRole | null> {
        const user = await userModel.findOne({
            email: email.trim().toLowerCase(),
        })
            .select('+password')
            .populate({
                path: 'role',
                populate: {
                    path: 'permissions',
                },
            })
            .exec();

        return user as IUserWithPopulatedRole | null;
    }

    async findUserByPhone(phone: string) {
        return userModel.findOne({ phone });
    }

    async findUserByEmailOrPhone(email: string, phone?: string) {
        const conditions: ({ email: string } | { phone: string })[] = [
            { email },
        ];

        if (phone) {
            conditions.push({ phone });
        }

        return userModel.findOne({
            $or: conditions,
        });
    }

    async createUser(data: Partial<IUser>) {
        return userModel.create(data);
    }

    async findUserByRole(roleId: string) {
        return userModel.find({ role: roleId });
    }
}

export const authRepository = new AuthRepository();
