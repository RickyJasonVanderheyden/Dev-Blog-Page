import { Request, Response } from 'express';
import { registerUser, loginUser, updateProfile } from '../services/authService';
import { z } from 'zod';
import { AuthRequest } from '../middleware/authMiddleware';

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  avatar: z.preprocess((val) => (val === '' ? undefined : val), z.string().url().optional()),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const updateProfileSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  avatar: z.preprocess((val) => (val === '' ? undefined : val), z.string().url().optional()),
});

export async function register(req: Request, res: Response) {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await registerUser(validatedData);
    
    // Set HTTP-only cookie
    res.cookie('authToken', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    // Return user data without token
    res.status(201).json({ user: result.user });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors,
      });
    }
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await loginUser(validatedData);
    
    // Set HTTP-only cookie
    res.cookie('authToken', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    // Return user data without token
    res.json({ user: result.user });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors,
      });
    }
    res.status(401).json({ message: error.message || 'Login failed' });
  }
}

export async function updateProfileHandler(req: AuthRequest, res: Response) {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    const result = await updateProfile(req.userId!, validatedData);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors,
      });
    }
    res.status(400).json({ message: error.message || 'Profile update failed' });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    // Clear the HTTP-only cookie
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Logout failed' });
  }
}

