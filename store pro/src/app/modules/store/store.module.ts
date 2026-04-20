import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StoreRoutingModule } from "./store-routing.module";
import { StoreCatalogComponent } from "./components/catalog/catalog.component";
import {
    AboutComponent,
    CartComponent,
    CheckoutComponent,
    ProductDetailsComponent,
} from "./components";
import { ProductCardComponent } from "./components/product-card/product-card.component";

@NgModule({
    declarations: [
        StoreCatalogComponent,
        ProductDetailsComponent,
        CartComponent,
        CheckoutComponent,
        AboutComponent,
        ProductCardComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        StoreRoutingModule,
    ],
})
export class StoreModule {}
