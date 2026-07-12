import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { httpLogger } from './core/logger';
import { errorHandler } from './core/errors/error-handler';
import { loadRoutes } from './core/route-loader';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
];

app.use(
    cors({
        origin: function (origin, callback) {
            // allow requests with no origin (Postman, mobile apps)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    }),
);

app.use(httpLogger);

// Use Cookie Parser middleware to parse cookies
app.use(cookieParser());

// Use Helmet middleware to enhance security
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    }),
);

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome to the Auth Server' });
});

// Dynamic Route Loader
loadRoutes(app);

app.use(errorHandler);

export default app;
