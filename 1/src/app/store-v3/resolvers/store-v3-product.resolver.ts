import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { StoreV3Product } from "../models/store-v3-product.model";
import { StoreV3ProductsService } from "../services/store-v3-products.service";

// Resolvers run BEFORE a route activates.
// They are useful when you want data ready before showing the page.

@Injectable({
    providedIn: "root",
})
export class StoreV3ProductResolver
    implements Resolve<StoreV3Product | undefined>
{
    constructor(private productsService: StoreV3ProductsService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<StoreV3Product | undefined> {
        void state;
        const rawId = route.paramMap.get("id");
        const id = rawId ? Number(rawId) : NaN;

        if (Number.isNaN(id)) {
            return this.productsService.getProductById(-1);
        }

        return this.productsService.getProductById(id);
    }
}
