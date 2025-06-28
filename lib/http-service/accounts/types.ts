import { z } from "zod";
import { RefreshTokenSchema, SignInSchema, ChangePasswordSchema } from "./schema";

export type SignInPayload = z.infer<typeof SignInSchema>
export type RefreshTokenPayload = z.infer<typeof RefreshTokenSchema>
export type ChangePasswordPayload = z.infer<typeof ChangePasswordSchema>

export type SignInResponse = {
    accessToken: string; // The JWT access token
    refreshToken: string; // The refresh token
    tokenType: string; // The type of token, which is always "Bearer"
};

export type RefreshTokenResponse = {
    accessToken: string; // The JWT access token
    refreshToken: string; // The new refresh token
};

export type ChangePasswordResponse = {
    [key: string]: string; // Generic string response object
};