// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { UserRole, USER_ROLES } from "@/lib/types";

// Define the paths that should be public
const publicPaths = ["/login", "/forgot-password"];

// Define role-based access control rules
const accessRules = {
 // Admin can access everything - no restrictions
 [USER_ROLES.ADMIN]: {
   allowedPaths: ["*"], // Wildcard means all paths
   restrictedPaths: []
 },
 
 // Manager access rules
 [USER_ROLES.MANAGER]: {
   allowedPaths: [
     "/", // Dashboard
     "/profile",
     "/branches", // Can view branches (filtered to own)
     "/customers",
     "/products",
     "/products/*",
     "/categories", // Read-only
     "/colors", // Read-only
     "/thicknesses", // Read-only
     "/measurement-units", // Read-only
     "/measurement-units/new",
     "/inventory",
     "/inventory/products/*/add",
     "/inventory/products/*/history",
     "/inventory/products/*/adjustments/remove",
     "/inventory/products/*/adjustments/correct",
     "/inventory/batches/*/history",
     "/inventory/batches/*/add",
     "/batches",
     "/batches/*",
     "/orders",
     "/orders/*",
     "/pos",
     "/quotations",
     "/layaway",
     "/productions",
     "/productions/batches/*",
     "/productions/new",
     "/stock-movements",
     "/users", // Can manage branch users
     "/settings", // Branch settings only
     "/reports",
     "/referrals",
     "/referral-payments",
     "/referrals/new",
     "/referrals/*/delete",
     "/referrals/*/edit",
     "/referrals/*"
   ],
   restrictedPaths: [
     "/branches/*/edit", // Cannot edit branches
     "/branches/*/activate",
     "/branches/*/deactivate",
     "/categories/*/edit", // Cannot edit master data
     "/colors/*/edit",
     "/thicknesses/*/edit",
     "/measurement-units/*/edit"
   ]
 },
 
 // Sales Rep access rules
 [USER_ROLES.SALES_REP]: {
   allowedPaths: [
     "/", // Dashboard
     "/profile",
     "/customers",
     "/products",
     "/categories", // Read-only
     "/colors", // Read-only
     "/thicknesses", // Read-only
     "/measurement-units", // Read-only
     "/inventory",
     "/batches",
     "/orders",
     "/orders/*",
     "/pos",
     "/quotations",
     "/layaway",
     "/productions",
     "/stock-movements",
     "/reports"
   ],
   restrictedPaths: [
     "/users", // Cannot access user management
     "/users/*",
     "/settings", // Cannot access settings
     "/branches", // Read-only view of own branch
     "/branches/*/edit",
     "/branches/*/activate",
     "/branches/*/deactivate",
     "/categories/*/edit",
     "/colors/*/edit",
     "/thicknesses/*/edit",
     "/measurement-units/*/edit",
     "/products/*/delete", // Cannot delete products
     "/batches/*/delete" // Cannot delete batches
   ]
 }
};

// Helper function to check if a path matches a pattern
function pathMatches(path: string, pattern: string): boolean {
 if (pattern === "*") return true;
 if (pattern === path) return true;
 
 // Handle wildcard patterns like "/users/*"
 if (pattern.includes("*")) {
   const regexPattern = pattern.replace(/\*/g, ".*");
   return new RegExp(`^${regexPattern}$`).test(path);
 }
 
 // Handle dynamic routes like "/branches/[id]/edit"
 if (pattern.includes("[") && pattern.includes("]")) {
   const regexPattern = pattern.replace(/\[.*?\]/g, "[^/]+");
   return new RegExp(`^${regexPattern}$`).test(path);
 }
 
 return false;
}

// Helper function to check if user has access to a path
function hasAccess(userRole: UserRole, pathname: string): boolean {
 const rules = accessRules[userRole];
 if (!rules) return false;
 
 // Check if path is explicitly restricted
 for (const restrictedPath of rules.restrictedPaths) {
   if (pathMatches(pathname, restrictedPath)) {
     return false;
   }
 }
 
 // Check if path is allowed
 for (const allowedPath of rules.allowedPaths) {
   if (pathMatches(pathname, allowedPath)) {
     return true;
   }
 }
 
 return false;
}

// Helper function to get appropriate redirect URL based on role
function getRedirectUrl(userRole: UserRole, requestUrl: string): string {
 switch (userRole) {
   case USER_ROLES.ADMIN:
     return "/"; // Admin dashboard
   case USER_ROLES.MANAGER:
     return "/"; // Manager dashboard
   case USER_ROLES.SALES_REP:
     return "/"; // Sales rep dashboard
   default:
     return "/login";
 }
}

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

 // Extract user role from token
 const userRole = token.user?.role as UserRole;
 
 if (!userRole) {
   console.error("No role found in token");
   const loginUrl = new URL("/login", req.url);
   return NextResponse.redirect(loginUrl);
 }

 // Check if user has access to the requested path
 if (!hasAccess(userRole, pathname)) {
   console.log(`Access denied for role ${userRole} to path ${pathname}`);
   
   // Redirect to appropriate dashboard or unauthorized page
   const redirectUrl = new URL(getRedirectUrl(userRole, req.url), req.url);
   
   // Add a query parameter to show unauthorized message
   redirectUrl.searchParams.set("unauthorized", "true");
   redirectUrl.searchParams.set("attempted", pathname);
   
   return NextResponse.redirect(redirectUrl);
 }

 // Add user role and branch info to headers for use in pages/components
 const response = NextResponse.next();
 response.headers.set("x-user-role", userRole);
 
 if (token.user?.branchId) {
   response.headers.set("x-user-branch", token.user.branchId);
 }

 return response;
}

export const config = {
 matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot)$).*)"],
};