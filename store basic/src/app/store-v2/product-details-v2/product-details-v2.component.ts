import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, map, switchMap } from "rxjs";
import { StoreV2Product } from "../models/store-v2-product.model";
import { StoreV2Service } from "../services/store-v2.service";

@Component({
    selector: "app-product-details-v2",
    templateUrl: "./product-details-v2.component.html",
    styleUrls: ["./product-details-v2.component.css"],
})
export class ProductDetailsV2Component {
    // Route params are observable; switching by id keeps UI in sync with navigation.
    readonly product$: Observable<StoreV2Product | undefined> =
        this.route.paramMap.pipe(
            map((params) => Number(params.get("id"))),
            switchMap((id) => this.storeV2Service.getProductById(id)),
        );

    constructor(
        private route: ActivatedRoute,
        private storeV2Service: StoreV2Service,
    ) {}

    addToCart(product: StoreV2Product): void {
        this.storeV2Service.addToCart(product);
    }
}
