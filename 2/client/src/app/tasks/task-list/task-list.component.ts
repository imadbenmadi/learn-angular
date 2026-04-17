/**
 * task-list.component.ts
 * ----------------------
 * Shows the current user's tasks and allows delete.
 */

import { Component, OnInit } from "@angular/core";

import type { Task, TaskStatus } from "../../core/models/task.models";
import { TasksService } from "../../core/services/tasks.service";

@Component({
    selector: "app-task-list",
    templateUrl: "./task-list.component.html",
    styleUrls: ["./task-list.component.scss"],
})
export class TaskListComponent implements OnInit {
    public isLoading = false;
    public errorMessage: string | null = null;
    public tasks: Task[] = [];

    constructor(private tasksService: TasksService) {}

    ngOnInit(): void {
        this.load();
    }

    public load(): void {
        this.isLoading = true;
        this.errorMessage = null;

        this.tasksService.getAll().subscribe({
            next: (res) => {
                this.tasks = res.tasks;
                this.isLoading = false;
            },
            error: (err) => {
                this.errorMessage =
                    err?.error?.error?.message ?? "Failed to load tasks";
                this.isLoading = false;
            },
        });
    }

    public deleteTask(task: Task): void {
        const ok = confirm(`Delete task "${task.title}"?`);
        if (!ok) {
            return;
        }

        this.tasksService.delete(task.id).subscribe({
            next: () => {
                // Update UI without reloading everything
                this.tasks = this.tasks.filter((t) => t.id !== task.id);
            },
            error: (err) => {
                this.errorMessage =
                    err?.error?.error?.message ?? "Failed to delete task";
            },
        });
    }

    public statusBadgeClass(status: TaskStatus): string {
        switch (status) {
            case "TODO":
                return "bg-secondary";
            case "IN_PROGRESS":
                return "bg-warning text-dark";
            case "DONE":
                return "bg-success";
            default:
                return "bg-secondary";
        }
    }
}
