import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { TopBarComponent } from "./top-bar/top-bar.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductDetailsComponent } from "./product-details/product-details.component";
import { ProductAlertsComponent } from "./product-alerts/product-alerts.component";
import { CartComponent } from "./cart/cart.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ShippingComponent } from "./shipping/shipping.component";
import { ApiLoggingInterceptor } from "./api-logging.interceptor";
import { StoreV2ShellComponent } from "./store-v2/store-v2-shell/store-v2-shell.component";
import { CatalogComponent } from "./store-v2/catalog/catalog.component";
import { ProductTileComponent } from "./store-v2/product-tile/product-tile.component";
import { ProductDetailsV2Component } from "./store-v2/product-details-v2/product-details-v2.component";
import { CartV2Component } from "./store-v2/cart-v2/cart-v2.component";
import { LearningPlaygroundComponent } from "./store-v2/learning-playground/learning-playground.component";
import { StockLevelPipe } from "./store-v2/shared/stock-level.pipe";
import { SpotlightDirective } from "./store-v2/shared/spotlight.directive";
import { StoreV2EnterGuard } from "./store-v2/guards/store-v2-enter.guard";
import { STORE_V3_PRODUCTS_URL } from "./store-v3/tokens/store-v3.tokens";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forRoot([
            { path: "", component: ProductListComponent, pathMatch: "full" },
            { path: "products/:productId", component: ProductDetailsComponent },
            { path: "cart", component: CartComponent },
            { path: "shipping", component: ShippingComponent },
            {
                path: "store-v2",
                component: StoreV2ShellComponent,
                canActivate: [StoreV2EnterGuard],
                children: [
                    {
                        path: "",
                        component: CatalogComponent,
                    },
                    {
                        path: "product/:id",
                        component: ProductDetailsV2Component,
                    },
                    {
                        path: "cart",
                        component: CartV2Component,
                    },
                    {
                        path: "playground",
                        component: LearningPlaygroundComponent,
                    },
                ],
            },
            {
                path: "store-v3",
                loadChildren: () =>
                    import("./store-v3/store-v3.module").then(
                        (m) => m.StoreV3Module,
                    ),
            },
        ]),
    ],
    declarations: [
        AppComponent,
        TopBarComponent,
        ProductListComponent,
        ProductDetailsComponent,
        ProductAlertsComponent,
        CartComponent,
        ShippingComponent,
        StoreV2ShellComponent,
        CatalogComponent,
        ProductTileComponent,
        ProductDetailsV2Component,
        CartV2Component,
        LearningPlaygroundComponent,
        StockLevelPipe,
        SpotlightDirective,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiLoggingInterceptor,
            multi: true,
        },
        {
            provide: STORE_V3_PRODUCTS_URL,
            useValue: "/assets/store-v3-products.json",
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
