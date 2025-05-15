'use server';

import { accountsService } from "@/lib/http-service/accounts";
import { RefreshTokenPayload, RefreshTokenResponse, SignInPayload, SignInResponse } from "@/lib/http-service/accounts/types";
import { APIResponse } from "@/lib/http-service/apiClient";


export async function signInAction(payload: SignInPayload): Promise<APIResponse<SignInResponse>> {
    return await accountsService.signIn(payload);
}

export async function refreshTokenAction(payload: RefreshTokenPayload): Promise<APIResponse<RefreshTokenResponse>> {
    return await accountsService.refreshToken(payload);
}
