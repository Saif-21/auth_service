import express from 'express';
import {
    forgotPasswordController,
    getCurrentUserController,
    loginController,
    logoutAllController,
    logoutController,
    refreshTokenController,
    registerController,
    resetPasswordController,
    updateProfileController,
} from '../controllers/auth.controller';
import { validate } from '@/middleware/validate.middleware';
import {
    ForgotPasswordJoiSchema,
    LoginJoiSchema,
    registerJoiSchema,
    ResetPasswordJoiSchema,
    UpdateProfileJoiSchema,
} from '../validators/auth.validator';
import { authenticate } from '@/middleware/auth.middleware';

const AuthRouter = express.Router();

export default (app: express.Application) => {
    AuthRouter.post(
        '/register',
        validate(registerJoiSchema),
        registerController,
    );

    AuthRouter.post('/login', validate(LoginJoiSchema), loginController);

    AuthRouter.post('/refresh', refreshTokenController); // Refresh Access Token

    AuthRouter.post(
        '/forgot-password',
        validate(ForgotPasswordJoiSchema),
        forgotPasswordController,
    );

    AuthRouter.post(
        '/reset-password',
        validate(ResetPasswordJoiSchema),
        resetPasswordController,
    );

    AuthRouter.get('/me', authenticate, getCurrentUserController);

    AuthRouter.patch(
        '/profile',
        authenticate,
        validate(UpdateProfileJoiSchema),
        updateProfileController,
    );

    AuthRouter.post('/logout', authenticate, logoutController);
    
    AuthRouter.post('/logout-all', authenticate, logoutAllController);

    app.use('/api/v1/auth', AuthRouter);
};
