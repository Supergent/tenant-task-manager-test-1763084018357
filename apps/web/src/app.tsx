import { RouterProvider } from '@tanstack/react-router'
import { getRouter } from './router'
import './app.css'

export default function App() {
  const router = getRouter()
  return <RouterProvider router={router} />
}
