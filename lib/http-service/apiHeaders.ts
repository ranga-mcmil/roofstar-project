import { Session } from "@/types";

type Headers = Record<string, string>;

export class HeaderService {
    async getHeaders(session?: Session | null ): Promise<Headers> {
        const headers: Headers = {
            'Content-Type': 'application/json',
        };

        if (session) {
            headers["Authorization"] = `Bearer ${session.accessToken}`;
        }

        return headers;
    }
}

export const apiHeaderService = new HeaderService();
