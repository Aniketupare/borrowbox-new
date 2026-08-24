import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { registerSchema, loginSchema } from '../utils/validation';

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await authService.registerUser(validatedData);
    res.cookie('jwt', user.token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const user = await authService.loginUser(validatedData);
    res.cookie('jwt', user.token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    res.status(200).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out' });
};

export const getMe = async (req: Request, res: Response) => {
  const user = await authService.getUserById((req as any).user);
  res.status(200).json(user);
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    await authService.forgotPassword(email);
    res.status(200).json({ message: 'If an account exists for this email, you will receive a password reset link shortly.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error sending password reset email' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password) {
      return res.status(400).json({ message: 'Email, token, and new password are required' });
    }
    await authService.resetPassword(email, token, password);
    res.status(200).json({ message: 'Password has been successfully reset.' });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid or expired password reset token' });
  }
};
