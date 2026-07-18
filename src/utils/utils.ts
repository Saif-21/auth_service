import { HASH_LENGTH, SALT_ROUNDS } from '@/constants/auth.constant';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = randomBytes(SALT_ROUNDS).toString('hex');
    const hash = scryptSync(password, salt, HASH_LENGTH).toString('hex');

    return `${salt}:${hash}`;
};

export const verifyPassword = async (
    password: string,
    storedHash: string,
): Promise<boolean> => {
    const [salt, hash] = storedHash.split(':');
    const hashBuffer = Buffer.from(hash, 'hex');
    const verifyBuffer = scryptSync(password, salt, HASH_LENGTH);

    return timingSafeEqual(hashBuffer, verifyBuffer);
};
