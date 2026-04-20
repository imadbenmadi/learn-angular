/**
 * tasks-routing.module.ts
 * -----------------------
 * Routes under /tasks
 */

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { authGuard } from "../core/guards/auth.guard";
import { TaskFormComponent } from "./task-form/task-form.component";
import { TaskListComponent } from "./task-list/task-list.component";

const routes: Routes = [
    { path: "", component: TaskListComponent, canActivate: [authGuard] },
    { path: "new", component: TaskFormComponent, canActivate: [authGuard] },
    {
        path: ":id/edit",
        component: TaskFormComponent,
        canActivate: [authGuard],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TasksRoutingModule {}
