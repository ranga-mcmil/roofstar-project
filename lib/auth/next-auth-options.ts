import { AuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { JWT } from "next-auth/jwt";
import { refreshTokenAction, signInAction } from "@/actions/accounts";

interface DecodedToken {
    sub: string;
    role: string;
    userId: string;
    exp: number;
    iat: number;
    iss: string
}

export const authOptions: AuthOptions = {
    pages: {
        signIn: '/login',
    },
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith@email.com" },
                password: { label: "Password", type: "password" }
            },
            
            async authorize(credentials, req) {
                const response = await signInAction({
                    email: credentials?.email as string,
                    password: credentials?.password as string,
                })

                const data = response.data;
 
                if (response.success) {
                    const decodedToken: DecodedToken = jwtDecode(data!.accessToken);
                    const tokenExp = decodedToken.exp

                    return {
                        token: data!.accessToken,
                        refreshToken: data!.refreshToken,
                        tokenExpiresAt: tokenExp, // Add expiration time

                        role: decodedToken.role,
                        email: decodedToken.sub,
                        id: decodedToken.userId,
                    };
                } else {
                    throw new Error(response.error);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: any; user?: any }) {
            // On initial sign-in, store token, refreshToken, and expiry time
            if (user) {
                token.accessToken = user.token;
                token.refreshToken = user.refreshToken;
                token.expiresAt = user.tokenExpiresAt;
                token.user = {
                    id: user.id,
                    role: user.role,
                    email: user.email,
                };
            }

            // Check if the token has expired
            const now = Date.now() / 1000;
           

            if (token.expiresAt && now > token.expiresAt) {
                // Token expired: refresh or clear the token
                try {

                    const response = await refreshTokenAction({
                        refreshToken: token.refreshToken,
                    });

                    const data = response.data;

                    if (response.success) {
                        const decodedToken: DecodedToken = jwtDecode(data!.accessToken);
                        const tokenExp = decodedToken.exp

                        token.accessToken = data!.accessToken;
                        token.refreshToken = data!.refreshToken;
                        token.expiresAt = tokenExp; // Update expiry time
                    } else {
                        token = {} as JWT; 
                    }
                } catch (error) {
                    token = {} as JWT; // Clear token if error occurs
                }
            }

            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            session.accessToken = token?.accessToken as string;
            session.user = token?.user as User;
            session.expiresAt = token?.expiresAt as string;
            session.expires = token?.expiresAt as string;
            session.refreshToken = token?.refreshToken as string;
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
}
