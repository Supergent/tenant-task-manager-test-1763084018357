/**
 * TaskForm Component
 *
 * Form for creating and editing tasks
 */

import { useState, FormEvent } from "react";
import { api } from "backend/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "backend/convex/_generated/dataModel";

interface TaskFormProps {
  taskId?: Id<"tasks">;
  initialData?: {
    title: string;
    description: string;
    dueDate?: number;
    priority: "low" | "medium" | "high";
    status: "todo" | "in-progress" | "done";
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TaskForm({ taskId, initialData, onSuccess, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : ""
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    initialData?.priority ?? "medium"
  );
  const [status, setStatus] = useState<"todo" | "in-progress" | "done">(
    initialData?.status ?? "todo"
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createTask = useMutation(api.endpoints.tasks.create);
  const updateTask = useMutation(api.endpoints.tasks.update);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const dueDateTimestamp = dueDate ? new Date(dueDate).getTime() : undefined;

      if (taskId) {
        // Update existing task
        await updateTask({
          taskId,
          title,
          description,
          dueDate: dueDateTimestamp,
          priority,
          status,
        });
      } else {
        // Create new task
        await createTask({
          title,
          description,
          dueDate: dueDateTimestamp,
          priority,
          status,
        });
      }

      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setStatus("todo");

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>{taskId ? "Edit Task" : "Create New Task"}</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">
          Title <span className="required">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          maxLength={200}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">
          Description <span className="required">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          required
          maxLength={2000}
          rows={4}
        />
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">
            Priority <span className="required">*</span>
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">
            Status <span className="required">*</span>
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "todo" | "in-progress" | "done")
            }
            required
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? "Saving..." : taskId ? "Update Task" : "Create Task"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
