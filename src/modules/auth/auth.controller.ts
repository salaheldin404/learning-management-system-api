import { Request, Response } from 'express';

import { SignupInput, LoginInput, ForgotPasswordInput, ResetPasswordInput, ResetPasswordParams } from './auth.schema';
import { forgotPasswordService, loginService, refreshTokenService, signupService, sessionService, resetPasswordService } from './auth.service';
import { clearSession, setSession } from '@/common/utils/session';
import AppError from '@/common/errors/appError';

export const signup = async (req: Request<{}, {}, SignupInput>, res: Response) => {
    const user = await signupService(req.body);
    res.status(201).json({ message: 'User created successfully', user });
};

export const login = async (req: Request<{}, {}, LoginInput>, res: Response) => {
    const user = await loginService(req.body);
    setSession(res, user.id)

    res.status(200).json({ message: 'Login successful', user });
};

export const logout = async (req: Request, res: Response) => {
    clearSession(res);
    res.status(200).json({ message: 'Logout successful' });
};

export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const newToken = await refreshTokenService(refreshToken);

    res.status(200).json({ token: newToken });
};

export const forgotPassword = async (req: Request<{}, {}, ForgotPasswordInput>, res: Response) => {
    const { email } = req.body;

    await forgotPasswordService(email);

    res.status(200).json({ message: 'Password reset email sent' });
};

export const session = async (req: Request, res: Response) => {
    const token = req.cookies?.token;

    if (!token) {
        throw new AppError('You are not logged in! Please log in to get access.', 401);
    }

    const user = await sessionService(token);

    res.status(200).json({ user });
};

export const resetPassword = async (
    req: Request<ResetPasswordParams, {}, ResetPasswordInput>,
    res: Response
) => {
    const user = await resetPasswordService(req.params.token, req.body);
    setSession(res, user.id);

    res.status(200).json({ message: 'Password reset successful', user });
};
