import { Request, Response } from 'express';
import { asyncHandler, sendSuccess } from '../utils/response';
import { registerUser, loginUser } from '../services/auth.service';

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { user, token } = await registerUser(req.body);
  sendSuccess(res, 'Registration successful', { user, token }, 201);
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { user, token } = await loginUser(req.body);
  sendSuccess(res, 'Login successful', { user, token });
});

export const getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  sendSuccess(res, 'User fetched successfully', { user: req.user });
});
