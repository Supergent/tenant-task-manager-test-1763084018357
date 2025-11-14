/**
 * Helper Layer: Validation
 *
 * Pure utility functions for input validation.
 * No database access - pure functions only.
 */

import { Priority, Status } from "../db/tasks";

/**
 * Validate task title
 */
export function validateTitle(title: string): { valid: boolean; error?: string } {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: "Title cannot be empty" };
  }

  if (title.length > 200) {
    return { valid: false, error: "Title cannot exceed 200 characters" };
  }

  return { valid: true };
}

/**
 * Validate task description
 */
export function validateDescription(description: string): { valid: boolean; error?: string } {
  if (description.length > 2000) {
    return { valid: false, error: "Description cannot exceed 2000 characters" };
  }

  return { valid: true };
}

/**
 * Validate due date
 */
export function validateDueDate(dueDate?: number): { valid: boolean; error?: string } {
  if (dueDate === undefined) {
    return { valid: true };
  }

  if (dueDate < 0) {
    return { valid: false, error: "Invalid due date" };
  }

  return { valid: true };
}

/**
 * Validate priority value
 */
export function isValidPriority(priority: string): priority is Priority {
  return ["low", "medium", "high"].includes(priority);
}

/**
 * Validate status value
 */
export function isValidStatus(status: string): status is Status {
  return ["todo", "in-progress", "done"].includes(status);
}
