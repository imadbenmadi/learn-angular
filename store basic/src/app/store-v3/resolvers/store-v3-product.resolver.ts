import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Observable, delay } from "rxjs";
import { StoreV3Product } from "../models/store-v3-product.model";
import { StoreV3ProductsService } from "../services/store-v3-products.service";

// Resolvers run BEFORE a route activates.
// They are useful when you want data ready before showing the page.

export const storeV3ProductResolver: ResolveFn<StoreV3Product | undefined> = (
    route,
    state,
): Observable<StoreV3Product | undefined> => {
    const productsService = inject(StoreV3ProductsService);

    // Debug helper: increase to simulate a slow resolver.
    // While this delay is in place, the router will WAIT
    //  here before activating the route.
    const simulateDelayMs = 5000;

    void state;
    const rawId = route.paramMap.get("id");
    const id = rawId ? Number(rawId) : NaN;

    if (Number.isNaN(id)) {
        return productsService.getProductById(-1).pipe(delay(simulateDelayMs));
    }

    return productsService.getProductById(id).pipe(delay(simulateDelayMs));
};
