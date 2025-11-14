/**
 * Better Auth Component Integration
 *
 * This exports the Better Auth component which provides:
 * - User authentication and session management
 * - Email/password authentication
 * - Session storage in Convex database
 *
 * The component automatically creates and manages the necessary database tables
 * for users, sessions, and authentication tokens.
 *
 * Usage in queries/mutations:
 * - Use `await auth.getUserOrThrow(ctx)` to get the authenticated user
 * - Use `await auth.getUser(ctx)` to optionally get the user (returns null if not authenticated)
 */
export { component as authComponent } from "@convex-dev/better-auth/convex";
