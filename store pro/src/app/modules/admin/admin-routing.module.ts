import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {
    AdminCategoriesComponent,
    AdminOrdersComponent,
    AdminProductsComponent,
    AdminShellComponent,
} from "./components";

const routes: Routes = [
    {
        path: "",
        component: AdminShellComponent,
        children: [
            { path: "", redirectTo: "products", pathMatch: "full" },
            { path: "products", component: AdminProductsComponent },
            { path: "categories", component: AdminCategoriesComponent },
            { path: "orders", component: AdminOrdersComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
