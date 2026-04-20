import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { pendingChangesGuard } from "./guards/pending-changes.guard";
import { storeV3ProductResolver } from "./resolvers/store-v3-product.resolver";
import { StoreV3TypedFormsComponent } from "./forms/store-v3-typed-forms.component";
import { StoreV3OverviewComponent } from "./overview/store-v3-overview.component";
import { StoreV3ProductDetailsComponent } from "./product-details/store-v3-product-details.component";
import { StoreV3ShellComponent } from "./store-v3-shell/store-v3-shell.component";

const routes: Routes = [
    {
        path: "",
        component: StoreV3ShellComponent,
        children: [
            { path: "", redirectTo: "overview", pathMatch: "full" },
            { path: "overview", component: StoreV3OverviewComponent },
            {
                path: "product/:id",
                component: StoreV3ProductDetailsComponent,
                resolve: {
                    product: storeV3ProductResolver,
                },
            },
            {
                path: "forms",
                component: StoreV3TypedFormsComponent,
                canDeactivate: [pendingChangesGuard],
            },
            {
                path: "standalone",
                loadComponent: () =>
                    import("./standalone/standalone-demo.component").then(
                        (m) => m.StandaloneDemoComponent,
                    ),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StoreV3RoutingModule {}
