import mongoose from 'mongoose';
import { config } from './config';

mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established successfully');
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection runtime error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection disconnected');
});

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(config.MONGO_URI, {
            autoIndex: config.NODE_ENV !== 'production', 
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
    } catch (error) {
        console.error('Fatal error during initial database connection:', error);
        process.exit(1);
    }
};

export const closeDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed gracefully via application termination');
  }
};
