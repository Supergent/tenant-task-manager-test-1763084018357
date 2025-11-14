/**
 * Better Auth Client Configuration
 *
 * Client-side authentication setup.
 * baseURL is auto-detected by Better Auth (uses current origin).
 */

import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  // baseURL defaults to window.location.origin
  // Vite proxy will forward /api/auth/* to Convex
  fetchOptions: {
    credentials: "include", // CRITICAL: Include cookies in all auth requests
  },
  plugins: [
    convexClient(), // Required for Convex integration
  ],
});

// Export authentication methods and hooks
export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
