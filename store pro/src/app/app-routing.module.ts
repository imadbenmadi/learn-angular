import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { AdminGuard } from "./guards/admin.guard";

const routes: Routes = [
    {
        path: "",
        redirectTo: "store",
        pathMatch: "full",
    },
    {
        path: "store",
        loadChildren: () =>
            import("./modules/store/store.module").then((m) => m.StoreModule),
    },
    {
        path: "auth",
        loadChildren: () =>
            import("./modules/auth/auth.module").then((m) => m.AuthModule),
    },
    {
        path: "admin",
        loadChildren: () =>
            import("./modules/admin/admin.module").then((m) => m.AdminModule),
        canActivate: [AdminGuard],
    },
    {
        path: "profile",
        loadChildren: () =>
            import("./modules/profile/profile.module").then(
                (m) => m.ProfileModule,
            ),
        canActivate: [AuthGuard],
    },
    {
        path: "**",
        redirectTo: "store",
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
