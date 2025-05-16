import { z } from "zod";
import { RefreshTokenSchema, SignInSchema } from "./schema";

export type SignInPayload = z.infer<typeof SignInSchema>
export type RefreshTokenPayload = z.infer<typeof RefreshTokenSchema>


export type SignInResponse = {
    accessToken: string; // The JWT access token
    refreshToken: string; // The type of token, which is always "Bearer"
    tokenType: string; // The type of token, which is always "Bearer"
};

export type RefreshTokenResponse = {
    accessToken: string; // The JWT access token
    refreshToken: string; // The type of token, which is always "Bearer"
};
