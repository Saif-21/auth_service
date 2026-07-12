import { config } from '@/config/config'
import { closeDB, connectDB } from '@/config/database';
import app from './src/app';

const startServer = async () => {
    // Connect to the database before starting the server
    await connectDB();

    // Start the server after successful database connection
    const server = app.listen(config.PORT, () => {
        console.log(`Server up and running on port ${config.PORT}`);
    });

    const handleShutdown = async (signal: string) => {
        console.log(`Received ${signal}. Starting graceful shutdown.`);

        server.close(async () => {
            console.log('HTTP Server closed.');
            await closeDB();
            process.exit(0);
        });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
};

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection at Promise:', err);
    process.exit(1);
});

startServer();
