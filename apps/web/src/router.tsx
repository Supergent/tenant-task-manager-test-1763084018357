import { createRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import { authClient } from './lib/auth-client'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const CONVEX_URL = import.meta.env.VITE_CONVEX_URL!
  if (!CONVEX_URL) {
    console.error('missing envar VITE_CONVEX_URL')
  }

  // Convex Query Client setup
  const convexQueryClient = new ConvexQueryClient(CONVEX_URL)

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
        gcTime: 5000,
      },
    },
  })
  convexQueryClient.connect(queryClient)

  const router = routerWithQueryClient(
    createRouter({
      routeTree,
      defaultPreload: 'intent',
      context: {
        queryClient,
        convexClient: convexQueryClient.convexClient,
        convexQueryClient,
      },
      scrollRestoration: true,
      defaultPreloadStaleTime: 0,
      defaultErrorComponent: (err) => <p>{err.error.stack}</p>,
      defaultNotFoundComponent: () => <p>not found</p>,
      Wrap: ({ children }) => (
        <ConvexBetterAuthProvider
          client={convexQueryClient.convexClient}
          authClient={authClient}
        >
          {children}
        </ConvexBetterAuthProvider>
      ),
    }),
    queryClient,
  )

  return router
}
