import { z } from 'zod';

export const SignInSchema = z.object({
    email: z.string().email({ message: 'Enter a valid email address' })
        .min(1, { message: 'Email is required' })
        .max(50, { message: 'Email must be at most 50 characters long' })
        .refine((value) => !value.includes(' '), {
        message: 'Email must not contain spaces'
        }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export const RefreshTokenSchema = z.object({
    refreshToken: z.string(),
});

export const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: 'Current password is required' }),
    newPassword: z.string().min(1, { message: 'New password is required' }),
});