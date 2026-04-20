import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, catchError, map, of, shareReplay } from "rxjs";
import { StoreV3Product } from "../models/store-v3-product.model";
import { STORE_V3_PRODUCTS_URL } from "../tokens/store-v3.tokens";

@Injectable({
    providedIn: "root",
})
export class StoreV3ProductsService {
    // A cached stream: first subscriber triggers the request, later subscribers
    // get the same cached value.
    private readonly products$: Observable<StoreV3Product[]>;

    constructor(
        private http: HttpClient,
        @Inject(STORE_V3_PRODUCTS_URL) private productsUrl: string,
    ) {
        this.products$ = this.http.get<StoreV3Product[]>(this.productsUrl).pipe(
            // Example: normalize data in one place.
            map((products) =>
                products.map((p) => ({
                    ...p,
                    tags: (p.tags ?? []).filter(Boolean),
                })),
            ),
            // Example: show how to react to HTTP errors.
            catchError((error: unknown) => this.handleError(error)),
            // Cache 1 value for all subscribers.
            shareReplay(1),
        );
    }

    getProducts(): Observable<StoreV3Product[]> {
        return this.products$;
    }

    getProductById(id: number): Observable<StoreV3Product | undefined> {
        return this.products$.pipe(
            map((products) => products.find((p) => p.id === id)),
        );
    }

    private handleError(error: unknown): Observable<StoreV3Product[]> {
        if (error instanceof HttpErrorResponse) {
            console.error(
                "[StoreV3ProductsService] HTTP error",
                error.status,
                error.message,
            );
        } else {
            console.error("[StoreV3ProductsService] Unknown error", error);
        }

        // For a learning app, returning an empty list keeps the UI usable.
        // In real apps you might rethrow (throwError) or show a toast.
        return of([]);
    }
}
