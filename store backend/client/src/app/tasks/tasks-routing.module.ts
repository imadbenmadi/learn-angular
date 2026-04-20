/**
 * tasks-routing.module.ts
 * -----------------------
 * Routes under /tasks
 */

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../core/guards/auth.guard";
import { TaskFormComponent } from "./task-form/task-form.component";
import { TaskListComponent } from "./task-list/task-list.component";

const routes: Routes = [
    { path: "", component: TaskListComponent, canActivate: [AuthGuard] },
    { path: "new", component: TaskFormComponent, canActivate: [AuthGuard] },
    {
        path: ":id/edit",
        component: TaskFormComponent,
        canActivate: [AuthGuard],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TasksRoutingModule {}
