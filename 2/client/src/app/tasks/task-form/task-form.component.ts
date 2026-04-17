/**
 * task-form.component.ts
 * ----------------------
 * Create + Edit form.
 *
 * Route:
 * - /tasks/new      -> create
 * - /tasks/:id/edit -> edit
 */

import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";

import type { TaskStatus } from "../../core/models/task.models";
import type { TaskUpsertDto } from "../../core/services/tasks.service";
import { TasksService } from "../../core/services/tasks.service";

@Component({
    selector: "app-task-form",
    templateUrl: "./task-form.component.html",
    styleUrls: ["./task-form.component.scss"],
})
export class TaskFormComponent implements OnInit {
    public isEditMode = false;
    public isLoading = false;
    public isSubmitting = false;
    public errorMessage: string | null = null;

    private taskId: number | null = null;

    public readonly statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

    public readonly form = this.fb.group({
        title: ["", [Validators.required, Validators.minLength(2)]],
        description: [""],
        status: ["TODO" as TaskStatus, [Validators.required]],
        dueDate: [""],
    });

    constructor(
        private fb: FormBuilder,
        private tasksService: TasksService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get("id");

        if (idParam) {
            const parsed = Number(idParam);
            if (!Number.isFinite(parsed) || parsed <= 0) {
                this.errorMessage = "Invalid task id";
                return;
            }

            this.isEditMode = true;
            this.taskId = parsed;
            this.loadTask(parsed);
        }
    }

    private loadTask(id: number): void {
        this.isLoading = true;
        this.errorMessage = null;

        this.tasksService
            .getById(id)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
                next: (res) => {
                    // Patch form with existing values
                    this.form.patchValue({
                        title: res.task.title,
                        description: res.task.description ?? "",
                        status: res.task.status,
                        dueDate: res.task.dueDate ?? "",
                    });
                },
                error: (err) => {
                    this.errorMessage =
                        err?.error?.error?.message ?? "Failed to load task";
                },
            });
    }

    public submit(): void {
        this.errorMessage = null;

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const dto: TaskUpsertDto = {
            title: (this.form.value.title ?? "").trim(),
            description: (this.form.value.description ?? "").trim() || null,
            status: this.form.value.status as TaskStatus,
            dueDate: (this.form.value.dueDate ?? "").trim() || null,
        };

        this.isSubmitting = true;

        const request$ =
            this.isEditMode && this.taskId
                ? this.tasksService.update(this.taskId, dto)
                : this.tasksService.create(dto);

        request$.pipe(finalize(() => (this.isSubmitting = false))).subscribe({
            next: () => {
                this.router.navigate(["/tasks"]);
            },
            error: (err) => {
                this.errorMessage =
                    err?.error?.error?.message ?? "Failed to save task";
            },
        });
    }

    public cancel(): void {
        this.router.navigate(["/tasks"]);
    }
}
