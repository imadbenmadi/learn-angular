import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { StoreV3RoutingModule } from "./store-v3-routing.module";
import { StoreV3ShellComponent } from "./store-v3-shell/store-v3-shell.component";
import { StoreV3OverviewComponent } from "./overview/store-v3-overview.component";
import { StoreV3ProductDetailsComponent } from "./product-details/store-v3-product-details.component";
import { StoreV3TypedFormsComponent } from "./forms/store-v3-typed-forms.component";
import { StarsRatingControlComponent } from "./forms/stars-rating-control/stars-rating-control.component";

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, StoreV3RoutingModule],
    declarations: [
        StoreV3ShellComponent,
        StoreV3OverviewComponent,
        StoreV3ProductDetailsComponent,
        StoreV3TypedFormsComponent,
        StarsRatingControlComponent,
    ],
})
export class StoreV3Module {}
