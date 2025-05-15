// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

// import NextAuth from 'next-auth';
// import { authOptions } from '@/lib/auth/next-auth-options';


// const { auth } = NextAuth(authOptions);

// export default auth((req: any) => {
//   if (!req.auth) {
//     const url = req.url.replace(req.nextUrl.pathname, '/');
//     return Response.redirect(url);
//   }
// });

// export const config = { matcher: ['/dashboard/:path*'] };


// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Define the paths that should be public
const publicPaths = ["/login", "/forgot-password"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths without authentication
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Retrieve the token (authenticated user)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token and path is protected, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)"],
};