# Task Manager - Web Application

Task management application with user authentication and personal task organization. Built with TanStack Start, Convex database, and Better Auth for authentication.

## Features

**Authentication**:
- Email and password authentication via Better Auth
- User registration and login flows
- Protected routes for authenticated users only

**Task Management Features**:
- Tasks include: title (string), description (text), due date (date), priority (low/medium/high enum), status (todo/in-progress/done enum)
- Full CRUD operations: create new tasks, edit existing tasks, delete tasks
- Quick action to mark tasks as complete (update status to done)
- Filter and view tasks by status (todo/in-progress/done)
- Filter and view tasks by priority (low/medium/high)
- User-specific task isolation: each user can only view and manage their own tasks

**Data Models**:
- Users: managed by Better Auth (email, password hash, user metadata)
- Tasks: userId (reference), title, description, dueDate, priority, status, createdAt, updatedAt

**Deployment**: Cloudflare Workers via TanStack Start framework for edge performance and global distribution.

## Tech Stack

- **Framework**: TanStack Start (React)
- **Backend**: Convex (serverless database)
- **Auth**: Better Auth
- **Styling**: Tailwind CSS v4
- **Deployment**: Cloudflare Workers
- **Package Manager**: Bun 1.2.18+
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Bun 1.2.18+ (enforced via packageManager field)
- Convex account (free tier available)
- Cloudflare account (for deployment)

### Installation

1. **Install dependencies** (from repository root):
   ```bash
   bun install
   ```

2. **Set up environment variables**:
   ```bash
   cd apps/web
   cp .env.local.example .env.local
   # Edit .env.local with your Convex URL
   ```

3. **Start Convex backend** (in packages/backend):
   ```bash
   cd ../../packages/backend
   bun run dev
   ```
   This will give you the `VITE_CONVEX_URL` to add to `apps/web/.env.local`

4. **Start the dev server** (in apps/web):
   ```bash
   cd ../../apps/web
   bun run dev
   ```

   The app will be available at http://localhost:5173

### Development Commands

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview production build locally
bun run start

# Deploy to Cloudflare Workers
bun run deploy
```

## Project Structure

```
apps/web/
├── src/
│   ├── routes/           # TanStack Router pages
│   │   ├── __root.tsx   # Root layout with auth provider
│   │   └── index.tsx    # Homepage
│   ├── components/       # React components
│   ├── lib/             # Utilities and client setup
│   │   └── auth-client.ts  # Better Auth client
│   ├── app.tsx          # Root app component
│   ├── app.css          # Global styles
│   └── router.tsx       # Router configuration
├── public/              # Static assets
├── vite.config.ts       # Vite configuration
├── app.config.ts        # TanStack Start configuration
├── wrangler.toml        # Cloudflare Workers config
└── package.json         # Dependencies and scripts
```

## Importing from Backend

The frontend has access to the shared backend package via workspace dependency:

```typescript
// Import Convex API
import { api } from "backend/convex/_generated/api";

// Use in React components
import { useQuery, useMutation } from "convex/react";

function MyComponent() {
  const tasks = useQuery(api.endpoints.tasks.list);
  const createTask = useMutation(api.endpoints.tasks.create);
  // ...
}
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Convex Backend URL
VITE_CONVEX_URL=https://your-project.convex.cloud

# Better Auth URL (should match backend)
VITE_BETTER_AUTH_URL=http://localhost:5173
```

## Deployment

### Cloudflare Workers

This app is configured for **Cloudflare Workers** deployment with GitHub Actions.

#### Automatic Deployment

Every push to the `main` branch automatically deploys via GitHub Actions:

1. Builds with Bun (fast!)
2. Deploys to Cloudflare Workers (edge network)
3. Available at your custom domain

#### Manual Deployment

You can also deploy manually using Wrangler:

```bash
# Build the application
bun run build

# Deploy to Cloudflare Workers
bun run deploy
```

Before deploying:
1. Update `wrangler.toml` with your Cloudflare account details
2. Set production environment variables in Cloudflare dashboard
3. Deploy the Convex backend: `cd packages/backend && bun run deploy`

#### View Deployment Status

Check deployment status at:
```
https://github.com/{{GITHUB_ORG}}/{{GITHUB_REPO}}/actions
```

## Authentication Flow

1. **User Registration**: Users sign up with email and password
2. **Session Management**: Better Auth handles session cookies automatically
3. **Protected Routes**: Routes check authentication status before rendering
4. **Auto-refresh**: Sessions are refreshed automatically

## Building Features

### Adding a New Page

1. Create a new route file in `src/routes/`:
   ```typescript
   // src/routes/tasks.tsx
   import { createFileRoute } from "@tanstack/react-router";

   export const Route = createFileRoute("/tasks")({
     component: TasksPage,
   });

   function TasksPage() {
     return <div>Tasks Page</div>;
   }
   ```

2. Link to it from other pages:
   ```typescript
   import { Link } from "@tanstack/react-router";

   <Link to="/tasks">Go to Tasks</Link>
   ```

### Using Backend Queries/Mutations

```typescript
import { api } from "backend/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

function TaskList() {
  // Query tasks
  const tasks = useQuery(api.endpoints.tasks.list);

  // Create task mutation
  const createTask = useMutation(api.endpoints.tasks.create);

  const handleCreate = async () => {
    await createTask({
      title: "New Task",
      description: "Task description",
      priority: "medium",
      status: "todo",
    });
  };

  return (
    <div>
      {tasks?.map(task => (
        <div key={task._id}>{task.title}</div>
      ))}
      <button onClick={handleCreate}>Create Task</button>
    </div>
  );
}
```

## Styling

This app uses **Tailwind CSS v4** with the new CSS-first configuration:

- Global styles: `src/app.css`
- Component styles: Use Tailwind utility classes
- Custom theme: Modify `@theme` in `app.css`

Example:
```typescript
<div className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
  Click me
</div>
```

## Learn More

- [TanStack Start Documentation](https://tanstack.com/start)
- [TanStack Router Documentation](https://tanstack.com/router)
- [Convex Documentation](https://docs.convex.dev)
- [Better Auth Documentation](https://www.better-auth.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers)

## Troubleshooting

### "Cannot find module 'backend/convex/_generated/api'"

Make sure you've run `bun run dev` in `packages/backend` to generate the Convex API types.

### Authentication not working

1. Check that `VITE_CONVEX_URL` is set correctly in `.env.local`
2. Ensure the Convex backend is running (`bun run dev` in `packages/backend`)
3. Verify `VITE_BETTER_AUTH_URL` matches your app's URL

### Build errors

1. Run `bun install` in the repository root to ensure all dependencies are installed
2. Check that you're using Bun 1.2.18+ (`bun --version`)
3. Clear build cache: `rm -rf .output node_modules/.vite`
