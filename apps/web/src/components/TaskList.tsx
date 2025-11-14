/**
 * TaskList Component
 *
 * Displays a list of tasks with filtering options
 */

import { useState } from "react";
import { api } from "backend/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { TaskItem } from "./TaskItem";
import { TaskForm } from "./TaskForm";

type FilterType = "all" | "todo" | "in-progress" | "done" | "low" | "medium" | "high";

export function TaskList() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [showForm, setShowForm] = useState(false);

  // Fetch tasks based on filter
  const allTasks = useQuery(api.endpoints.tasks.list);
  const todoTasks = useQuery(
    api.endpoints.tasks.listByStatus,
    filter === "todo" ? { status: "todo" } : "skip"
  );
  const inProgressTasks = useQuery(
    api.endpoints.tasks.listByStatus,
    filter === "in-progress" ? { status: "in-progress" } : "skip"
  );
  const doneTasks = useQuery(
    api.endpoints.tasks.listByStatus,
    filter === "done" ? { status: "done" } : "skip"
  );
  const lowPriorityTasks = useQuery(
    api.endpoints.tasks.listByPriority,
    filter === "low" ? { priority: "low" } : "skip"
  );
  const mediumPriorityTasks = useQuery(
    api.endpoints.tasks.listByPriority,
    filter === "medium" ? { priority: "medium" } : "skip"
  );
  const highPriorityTasks = useQuery(
    api.endpoints.tasks.listByPriority,
    filter === "high" ? { priority: "high" } : "skip"
  );

  // Determine which tasks to display
  const tasks =
    filter === "all"
      ? allTasks
      : filter === "todo"
      ? todoTasks
      : filter === "in-progress"
      ? inProgressTasks
      : filter === "done"
      ? doneTasks
      : filter === "low"
      ? lowPriorityTasks
      : filter === "medium"
      ? mediumPriorityTasks
      : highPriorityTasks;

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h1>My Tasks</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancel" : "New Task"}
        </button>
      </div>

      {showForm && (
        <div className="task-form-container">
          <TaskForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      <div className="filter-controls">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <button
            onClick={() => setFilter("all")}
            className={filter === "all" ? "active" : ""}
          >
            All
          </button>
          <button
            onClick={() => setFilter("todo")}
            className={filter === "todo" ? "active" : ""}
          >
            To Do
          </button>
          <button
            onClick={() => setFilter("in-progress")}
            className={filter === "in-progress" ? "active" : ""}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("done")}
            className={filter === "done" ? "active" : ""}
          >
            Done
          </button>
        </div>

        <div className="filter-group">
          <label>Filter by Priority:</label>
          <button
            onClick={() => setFilter("low")}
            className={filter === "low" ? "active priority-low" : "priority-low"}
          >
            Low
          </button>
          <button
            onClick={() => setFilter("medium")}
            className={filter === "medium" ? "active priority-medium" : "priority-medium"}
          >
            Medium
          </button>
          <button
            onClick={() => setFilter("high")}
            className={filter === "high" ? "active priority-high" : "priority-high"}
          >
            High
          </button>
        </div>
      </div>

      <div className="tasks-container">
        {tasks === undefined ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. Create your first task to get started!</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskItem key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
