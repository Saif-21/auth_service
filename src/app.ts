import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { httpLogger } from './core/logger';
import { errorHandler } from './core/errors/error-handler';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(errorHandler);

export default app;
