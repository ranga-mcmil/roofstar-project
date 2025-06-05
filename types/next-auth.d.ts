// types/next-auth.d.ts - Updated with branchId support
import { DefaultSession } from "next-auth";
import "next-auth/jwt";
import { UserRole } from "@/lib/types";

declare module "next-auth" {
    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the second parameter of the `session` callback, when using a database.
     */
    interface User {
        id: string;
        email: string;
        role: UserRole;
        branchId?: string; // Optional - only present for Manager and Sales Rep
    }

    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        accessToken: string;
        expiresAt: string;
        refreshToken: string;
        user: User;
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: string;
        user?: User;
    }
}