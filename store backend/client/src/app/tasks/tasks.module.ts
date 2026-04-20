/**
 * tasks.module.ts
 * --------------
 * Feature module for the authenticated "Tasks" area.
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { TaskFormComponent } from "./task-form/task-form.component";
import { TaskListComponent } from "./task-list/task-list.component";
import { TasksRoutingModule } from "./tasks-routing.module";

@NgModule({
    declarations: [TaskListComponent, TaskFormComponent],
    imports: [CommonModule, ReactiveFormsModule, TasksRoutingModule],
})
export class TasksModule {}
