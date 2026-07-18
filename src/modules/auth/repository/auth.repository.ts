import userModel from '../models/user.model';
import { IUser } from '../types/user.types';
class AuthRepository {
    async findUserByEmail(email: string) {
        return await userModel.findOne({ email });
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
}

export const authRepository = new AuthRepository();
