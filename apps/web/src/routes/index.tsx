/**
 * Home/Dashboard Route
 *
 * Main task management interface
 */

import { createFileRoute } from "@tanstack/react-router";
import { TaskList } from "../components/TaskList";
import { useSession } from "@/lib/auth-client";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {session ? (
        <div className="container">
          <TaskList />
        </div>
      ) : (
        <div className="container">
          <div className="welcome-section">
            <h1>Welcome to Task Manager</h1>
            <p>
              Organize your tasks efficiently with priority levels, status tracking,
              and due dates.
            </p>
            <div className="auth-buttons">
              <a href="/auth/login" className="btn-primary">
                Sign In
              </a>
              <a href="/auth/register" className="btn-secondary">
                Create Account
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
