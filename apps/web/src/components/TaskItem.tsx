/**
 * TaskItem Component
 *
 * Displays a single task with actions
 */

import { useState } from "react";
import { api } from "backend/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "backend/convex/_generated/dataModel";
import { TaskForm } from "./TaskForm";

interface Task {
  _id: Id<"tasks">;
  userId: string;
  title: string;
  description: string;
  dueDate?: number;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
  createdAt: number;
  updatedAt: number;
}

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const markComplete = useMutation(api.endpoints.tasks.markComplete);
  const deleteTask = useMutation(api.endpoints.tasks.remove);

  const handleMarkComplete = async () => {
    if (confirm("Mark this task as complete?")) {
      await markComplete({ taskId: task._id });
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask({ taskId: task._id });
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "No due date";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPriorityClass = (priority: string) => {
    return `priority-badge priority-${priority}`;
  };

  const getStatusClass = (status: string) => {
    return `status-badge status-${status}`;
  };

  if (isEditing) {
    return (
      <div className="task-item editing">
        <TaskForm
          taskId={task._id}
          initialData={{
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status: task.status,
          }}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className={`task-item ${task.status === "done" ? "completed" : ""}`}>
      <div className="task-header">
        <h3 onClick={() => setShowDetails(!showDetails)} style={{ cursor: "pointer" }}>
          {task.title}
        </h3>
        <div className="task-badges">
          <span className={getPriorityClass(task.priority)}>
            {task.priority}
          </span>
          <span className={getStatusClass(task.status)}>
            {task.status}
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="task-details">
          <p className="task-description">{task.description}</p>
          <div className="task-meta">
            <p>
              <strong>Due Date:</strong> {formatDate(task.dueDate)}
            </p>
            <p>
              <strong>Created:</strong> {formatDate(task.createdAt)}
            </p>
          </div>
        </div>
      )}

      <div className="task-actions">
        {task.status !== "done" && (
          <button onClick={handleMarkComplete} className="btn-success">
            Mark Complete
          </button>
        )}
        <button onClick={() => setIsEditing(true)} className="btn-secondary">
          Edit
        </button>
        <button onClick={handleDelete} className="btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
}
