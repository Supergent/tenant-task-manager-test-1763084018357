import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Database Schema for Task Manager Application
 *
 * Tables:
 * - tasks: User-specific task management with priority and status tracking
 *
 * Note: User authentication is handled by Better Auth component
 */
export default defineSchema({
  tasks: defineTable({
    // User reference for task isolation
    userId: v.string(),

    // Task details
    title: v.string(),
    description: v.string(),
    dueDate: v.optional(v.number()), // Unix timestamp in milliseconds

    // Task organization
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done")
    ),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    // Index for fetching all tasks for a specific user
    .index("by_userId", ["userId"])

    // Index for filtering by user and status
    .index("by_userId_status", ["userId", "status"])

    // Index for filtering by user and priority
    .index("by_userId_priority", ["userId", "priority"])

    // Index for sorting by due date within a user's tasks
    .index("by_userId_dueDate", ["userId", "dueDate"])

    // Index for sorting by creation date
    .index("by_userId_createdAt", ["userId", "createdAt"]),
});
