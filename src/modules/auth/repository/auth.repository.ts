import userModel from '../models/user.model';

class AuthRepository {
    async findUserByEmail(email: string) {
        return await userModel.findOne({ email });
    }
}

export const authRepository = new AuthRepository();
