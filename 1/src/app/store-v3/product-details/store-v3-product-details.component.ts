import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs";
import { StoreV3Product } from "../models/store-v3-product.model";

@Component({
    selector: "app-store-v3-product-details",
    templateUrl: "./store-v3-product-details.component.html",
    styleUrls: ["./store-v3-product-details.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreV3ProductDetailsComponent {
    // Resolver result lives on route.data.
    // Using an Observable keeps this component compatible with OnPush.
    readonly product$ = this.route.data.pipe(
        map((data) => data["product"] as StoreV3Product | undefined),
    );

    constructor(private route: ActivatedRoute) {}
}
