/**
 * app-routing.module.ts
 * ---------------------
 * Root routing config.
 *
 * We lazy-load feature modules:
 * - /auth  -> AuthModule
 * - /tasks -> TasksModule
 */

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NotFoundComponent } from "./not-found/not-found.component";

const routes: Routes = [
    { path: "", pathMatch: "full", redirectTo: "tasks" },

    {
        path: "auth",
        loadChildren: () =>
            import("./auth/auth.module").then((m) => m.AuthModule),
    },
    {
        path: "tasks",
        loadChildren: () =>
            import("./tasks/tasks.module").then((m) => m.TasksModule),
    },

    { path: "**", component: NotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
