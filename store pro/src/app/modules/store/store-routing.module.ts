import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StoreCatalogComponent } from "./components/catalog/catalog.component";
import {
    CartComponent,
    CheckoutComponent,
    ProductDetailsComponent,
} from "./components";
import { AuthGuard } from "../../guards/auth.guard";

const routes: Routes = [
    {
        path: "",
        component: StoreCatalogComponent,
    },
    {
        path: "product/:id",
        component: ProductDetailsComponent,
    },
    {
        path: "cart",
        component: CartComponent,
    },
    {
        path: "checkout",
        component: CheckoutComponent,
        canActivate: [AuthGuard],
    },
    {
        path: "about",
        component: StoreCatalogComponent, // Placeholder
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StoreRoutingModule {}
