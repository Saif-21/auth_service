import express from 'express';
import { registerController } from '../controllers/auth.controller';
import { validate } from '@/middleware/validate.middleware';
import { registerJoiSchema } from '../validators/auth.validator';

const AuthRouter = express.Router();

export default (app: express.Application) => {
    AuthRouter.post(
        '/register',
        validate(registerJoiSchema),
        registerController,
    );

    app.use('/api/v1/auth', AuthRouter);
};
