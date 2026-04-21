import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgGridAngular } from "ag-grid-angular";

import { AdminRoutingModule } from "./admin-routing.module";
import {
    AdminCategoriesComponent,
    AdminOrdersComponent,
    AdminProductsComponent,
    AdminShellComponent,
} from "./components";

@NgModule({
    declarations: [
        AdminShellComponent,
        AdminProductsComponent,
        AdminCategoriesComponent,
        AdminOrdersComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AgGridAngular,
        AdminRoutingModule,
    ],
})
export class AdminModule {}
