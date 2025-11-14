/**
 * Helper Layer: Constants
 *
 * Application-wide constants and configuration values.
 */

export const PRIORITY_LEVELS = {
  LOW: "low" as const,
  MEDIUM: "medium" as const,
  HIGH: "high" as const,
};

export const TASK_STATUS = {
  TODO: "todo" as const,
  IN_PROGRESS: "in-progress" as const,
  DONE: "done" as const,
};

export const PRIORITY_ORDER = {
  low: 1,
  medium: 2,
  high: 3,
} as const;

export const STATUS_LABELS = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
} as const;

export const PRIORITY_LABELS = {
  low: "Low Priority",
  medium: "Medium Priority",
  high: "High Priority",
} as const;
