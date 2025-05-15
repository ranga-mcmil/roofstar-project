// src/types.d.ts
// import { Session as AuthSession } from "@auth/core/types"; // Adjust import path if necessary


import { Session as AuthSession  } from "next-auth";

export interface Session extends AuthSession {
        accessToken: string;
}
