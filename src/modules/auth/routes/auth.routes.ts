import express from 'express';
import {
    loginController,
    registerController,
} from '../controllers/auth.controller';
import { validate } from '@/middleware/validate.middleware';
import {
    LoginJoiSchema,
    registerJoiSchema,
} from '../validators/auth.validator';

const AuthRouter = express.Router();

export default (app: express.Application) => {
    AuthRouter.post(
        '/register',
        validate(registerJoiSchema),
        registerController,
    );

    AuthRouter.post('/login', validate(LoginJoiSchema), loginController);

    app.use('/api/v1/auth', AuthRouter);
};
