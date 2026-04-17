import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StoreRoutingModule } from "./store-routing.module";
import { StoreCatalogComponent } from "./components/catalog/catalog.component";
import { ProductDetailsComponent } from "./components/product-details/product-details.component";
import { CartComponent } from "./components/cart/cart.component";
import { CheckoutComponent } from "./components/checkout/checkout.component";
import { ProductCardComponent } from "./components/product-card/product-card.component";

@NgModule({
    declarations: [
        StoreCatalogComponent,
        ProductDetailsComponent,
        CartComponent,
        CheckoutComponent,
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
