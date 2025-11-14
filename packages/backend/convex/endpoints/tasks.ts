/**
 * Endpoint Layer: Tasks
 *
 * Business logic layer that composes database operations.
 * Never uses ctx.db directly - imports from ../db instead.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import * as Tasks from "../db/tasks";
import {
  validateTitle,
  validateDescription,
  validateDueDate,
} from "../helpers/validation";

/**
 * Query: Get all tasks for the authenticated user
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Tasks.getTasksByUserId(ctx, authUser.id);
  },
});

/**
 * Query: Get tasks filtered by status
 */
export const listByStatus = query({
  args: {
    status: v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done")),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Tasks.getTasksByStatus(ctx, authUser.id, args.status);
  },
});

/**
 * Query: Get tasks filtered by priority
 */
export const listByPriority = query({
  args: {
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Tasks.getTasksByPriority(ctx, authUser.id, args.priority);
  },
});

/**
 * Query: Get a single task by ID
 */
export const get = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const task = await Tasks.getTaskById(ctx, args.taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    // Ensure user can only access their own tasks
    if (task.userId !== authUser.id) {
      throw new Error("Unauthorized");
    }

    return task;
  },
});

/**
 * Mutation: Create a new task
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    dueDate: v.optional(v.number()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    status: v.optional(
      v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done"))
    ),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Validate inputs
    const titleValidation = validateTitle(args.title);
    if (!titleValidation.valid) {
      throw new Error(titleValidation.error);
    }

    const descriptionValidation = validateDescription(args.description);
    if (!descriptionValidation.valid) {
      throw new Error(descriptionValidation.error);
    }

    const dueDateValidation = validateDueDate(args.dueDate);
    if (!dueDateValidation.valid) {
      throw new Error(dueDateValidation.error);
    }

    // Create task
    return await Tasks.createTask(ctx, {
      userId: authUser.id,
      title: args.title.trim(),
      description: args.description.trim(),
      dueDate: args.dueDate,
      priority: args.priority,
      status: args.status ?? "todo",
    });
  },
});

/**
 * Mutation: Update an existing task
 */
export const update = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    status: v.optional(
      v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done"))
    ),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Get the task and verify ownership
    const task = await Tasks.getTaskById(ctx, args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== authUser.id) {
      throw new Error("Unauthorized");
    }

    // Validate inputs if provided
    if (args.title !== undefined) {
      const titleValidation = validateTitle(args.title);
      if (!titleValidation.valid) {
        throw new Error(titleValidation.error);
      }
    }

    if (args.description !== undefined) {
      const descriptionValidation = validateDescription(args.description);
      if (!descriptionValidation.valid) {
        throw new Error(descriptionValidation.error);
      }
    }

    if (args.dueDate !== undefined) {
      const dueDateValidation = validateDueDate(args.dueDate);
      if (!dueDateValidation.valid) {
        throw new Error(dueDateValidation.error);
      }
    }

    // Prepare updates
    const updates: Tasks.UpdateTaskArgs = {};
    if (args.title !== undefined) updates.title = args.title.trim();
    if (args.description !== undefined) updates.description = args.description.trim();
    if (args.dueDate !== undefined) updates.dueDate = args.dueDate;
    if (args.priority !== undefined) updates.priority = args.priority;
    if (args.status !== undefined) updates.status = args.status;

    // Update task
    await Tasks.updateTask(ctx, args.taskId, updates);
  },
});

/**
 * Mutation: Delete a task
 */
export const remove = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Get the task and verify ownership
    const task = await Tasks.getTaskById(ctx, args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== authUser.id) {
      throw new Error("Unauthorized");
    }

    // Delete task
    await Tasks.deleteTask(ctx, args.taskId);
  },
});

/**
 * Mutation: Mark a task as complete (quick action)
 */
export const markComplete = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Get the task and verify ownership
    const task = await Tasks.getTaskById(ctx, args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== authUser.id) {
      throw new Error("Unauthorized");
    }

    // Mark as complete
    await Tasks.markTaskComplete(ctx, args.taskId);
  },
});
