/**
 * Database Layer: Tasks
 *
 * This layer contains ALL direct database operations for the tasks table.
 * Only this file should use ctx.db for tasks.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in-progress" | "done";

export interface CreateTaskArgs {
  userId: string;
  title: string;
  description: string;
  dueDate?: number;
  priority: Priority;
  status: Status;
}

export interface UpdateTaskArgs {
  title?: string;
  description?: string;
  dueDate?: number;
  priority?: Priority;
  status?: Status;
}

/**
 * Create a new task
 */
export async function createTask(ctx: MutationCtx, args: CreateTaskArgs) {
  const now = Date.now();
  return await ctx.db.insert("tasks", {
    ...args,
    createdAt: now,
    updatedAt: now,
  });
}

/**
 * Get a task by ID
 */
export async function getTaskById(ctx: QueryCtx, taskId: Id<"tasks">) {
  return await ctx.db.get(taskId);
}

/**
 * Get all tasks for a user
 */
export async function getTasksByUserId(ctx: QueryCtx, userId: string) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

/**
 * Get tasks by user and status
 */
export async function getTasksByStatus(
  ctx: QueryCtx,
  userId: string,
  status: Status
) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_userId_status", (q) =>
      q.eq("userId", userId).eq("status", status)
    )
    .order("desc")
    .collect();
}

/**
 * Get tasks by user and priority
 */
export async function getTasksByPriority(
  ctx: QueryCtx,
  userId: string,
  priority: Priority
) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_userId_priority", (q) =>
      q.eq("userId", userId).eq("priority", priority)
    )
    .order("desc")
    .collect();
}

/**
 * Update a task
 */
export async function updateTask(
  ctx: MutationCtx,
  taskId: Id<"tasks">,
  updates: UpdateTaskArgs
) {
  await ctx.db.patch(taskId, {
    ...updates,
    updatedAt: Date.now(),
  });
}

/**
 * Delete a task
 */
export async function deleteTask(ctx: MutationCtx, taskId: Id<"tasks">) {
  await ctx.db.delete(taskId);
}

/**
 * Mark a task as complete (status = done)
 */
export async function markTaskComplete(ctx: MutationCtx, taskId: Id<"tasks">) {
  await ctx.db.patch(taskId, {
    status: "done",
    updatedAt: Date.now(),
  });
}
