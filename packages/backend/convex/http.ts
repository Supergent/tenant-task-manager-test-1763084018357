import { httpRouter } from "convex/server";
import { auth } from "@convex-dev/better-auth/convex";

/**
 * HTTP Router Configuration
 *
 * This sets up HTTP endpoints for Better Auth authentication flows.
 * All auth-related HTTP requests (login, register, logout, etc.) are handled here.
 *
 * Endpoints:
 * - POST /auth/sign-up - User registration
 * - POST /auth/sign-in/email - Email/password login
 * - POST /auth/sign-out - Logout
 * - GET /auth/session - Get current session
 * - And more auth-related endpoints...
 */
const http = httpRouter();

// Mount Better Auth HTTP routes
auth.addHttpRoutes(http);

export default http;
