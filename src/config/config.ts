import { config as conf } from 'dotenv';
conf();

const _config = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGO_URI: String(process.env.MONGO_URI),
}

export const config = Object.freeze(_config);