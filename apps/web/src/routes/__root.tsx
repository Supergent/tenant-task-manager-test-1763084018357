import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import '../styles/app.css'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  ),
})
