/**
 * task.models.ts
 * --------------
 * Shared types for the task endpoints.
 */

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;

    // Dates are strings because the API returns dateStrings=true from MySQL.
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface TaskListResponse {
    tasks: Task[];
}

export interface TaskResponse {
    task: Task;
}
