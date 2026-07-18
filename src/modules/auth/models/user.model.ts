import { hashPassword, verifyPassword } from '@/utils/utils';
import { HydratedDocument, model, Schema } from 'mongoose';
import { IUser } from '../types/user.types';

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            unique: true,
            trim: true,
        },
        avatar: {
            type: String,
            default: null,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        permissions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Permission',
            },
        ],
    },
    {
        timestamps: true,
    },
);

userSchema.pre('save', async function (this: HydratedDocument<IUser>, next) {
    if (!this.isModified('password')) return;
    
    this.password = await hashPassword(this.password);
});

userSchema.methods.comparePassword = async function (
    password: string,
): Promise<boolean> {
    return await verifyPassword(password, this.password);
};

export default model<IUser>('User', userSchema);
