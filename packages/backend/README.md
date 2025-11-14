# Backend Package

Shared Convex backend for the task management application. This backend is designed to be platform-agnostic and can be used by web, mobile, and desktop clients.

## Architecture Overview

The backend follows a **four-layer architecture** for clean separation of concerns:

```
┌─────────────────────────────────────┐
│  Frontend (apps/web, apps/mobile)  │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│  Layer 1: endpoints/               │  ← Public API (queries/mutations/actions)
│  - Business logic entry points     │
│  - Input validation                │
│  - Authentication checks           │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│  Layer 2: db/                      │  ← Database operations
│  - CRUD operations                 │
│  - Data access patterns            │
│  - Type-safe database queries      │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│  Layer 3: helpers/                 │  ← Utilities and shared logic
│  - Validation functions            │
│  - Data transformations            │
│  - Common business rules           │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│  Layer 4: schema.ts, auth.ts       │  ← Core configuration
│  - Database schema                 │
│  - Authentication setup            │
└─────────────────────────────────────┘
```

## Directory Structure

```
convex/
├── db/              # Database layer (CRUD operations)
├── endpoints/       # Public API layer (queries, mutations, actions)
├── helpers/         # Utilities and shared logic
├── schema.ts        # Database schema definition
├── auth.ts          # Better Auth configuration
└── http.ts          # HTTP routes (auth endpoints)
```

## Development

### Prerequisites

- Bun 1.2.18+ (enforced via packageManager field)
- Convex CLI

### Setup

1. Install dependencies:
   ```bash
   bun install
   ```

2. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your values
   ```

3. Start the Convex dev server:
   ```bash
   bun run dev
   ```

### Environment Variables

- `CONVEX_DEPLOYMENT` - Your Convex deployment URL (get from `npx convex dev`)
- `AUTH_SECRET` - Secret key for session signing (generate with `openssl rand -base64 32`)
- `BETTER_AUTH_URL` - Base URL for your application (e.g., `http://localhost:5173`)

## Adding New Features

### 1. Define Database Schema

Edit `convex/schema.ts` to add new tables or modify existing ones:

```typescript
export default defineSchema({
  myNewTable: defineTable({
    field: v.string(),
    // ...
  }).index("by_field", ["field"]),
});
```

### 2. Create Database Operations (Layer 2)

Create `convex/db/myFeature.ts`:

```typescript
import { v } from "convex/values";
import { DatabaseReader, DatabaseWriter } from "./_generated/server";

export async function getItem(db: DatabaseReader, id: Id<"myNewTable">) {
  return await db.get(id);
}

export async function createItem(db: DatabaseWriter, data: { field: string }) {
  return await db.insert("myNewTable", data);
}
```

### 3. Create Public API (Layer 1)

Create `convex/endpoints/myFeature.ts`:

```typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "@convex-dev/better-auth/convex";

export const get = query({
  args: { id: v.id("myNewTable") },
  handler: async (ctx, args) => {
    const user = await auth.getUserOrThrow(ctx);
    // Use db layer functions here
  },
});

export const create = mutation({
  args: { field: v.string() },
  handler: async (ctx, args) => {
    const user = await auth.getUserOrThrow(ctx);
    // Use db layer functions here
  },
});
```

### 4. Use in Frontend

```typescript
import { api } from "backend/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

const item = useQuery(api.endpoints.myFeature.get, { id });
const create = useMutation(api.endpoints.myFeature.create);
```

## Authentication

This backend uses **Better Auth** for authentication:

- **Session Management**: Automatic session handling via Better Auth component
- **Protected Routes**: Use `await auth.getUserOrThrow(ctx)` in queries/mutations
- **User Context**: Access current user with `await auth.getUser(ctx)`

Example:
```typescript
import { mutation } from "./_generated/server";
import { auth } from "@convex-dev/better-auth/convex";

export const myProtectedMutation = mutation({
  handler: async (ctx) => {
    const user = await auth.getUserOrThrow(ctx);
    // user.id, user.email, etc.
  },
});
```

## Deployment

Deploy to Convex:
```bash
bun run deploy
```

The backend will be deployed and accessible via Convex's global edge network.

## Component Dependencies

This backend uses the following Convex components:

- **@convex-dev/better-auth**: Email/password authentication with session management
- **@convex-dev/rate-limiter**: Rate limiting for API endpoints

## Learn More

- [Convex Documentation](https://docs.convex.dev)
- [Better Auth Documentation](https://www.better-auth.com)
- [TanStack Start Documentation](https://tanstack.com/start)
