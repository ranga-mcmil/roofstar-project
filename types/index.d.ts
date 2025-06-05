// types/index.d.ts - Updated with branchId support
import { Session as AuthSession } from "next-auth";
import { UserRole } from "@/lib/types";

export interface Session extends AuthSession {
    accessToken: string;
    user: {
        id: string;
        email: string;
        role: UserRole;
        branchId?: string; // Optional - only present for Manager and Sales Rep
    };
}