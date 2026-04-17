import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    BehaviorSubject,
    Observable,
    catchError,
    map,
    of,
    shareReplay,
} from "rxjs";
import { STORE_V2_PRODUCTS } from "../data/store-v2-products";
import { StoreV2Product } from "../models/store-v2-product.model";

@Injectable({
    providedIn: "root",
})
export class StoreV2Service {
    // BehaviorSubject stores the latest cart state and emits updates to subscribers.
    private readonly cartItemsSubject = new BehaviorSubject<StoreV2Product[]>(
        [],
    );

    // Components subscribe to this stream to get cart updates.
    readonly cartItems$ : Observable<StoreV2Product[]> = this.cartItemsSubject.asObservable();

    // This derived stream computes total price from current cart items.
    readonly cartTotal$ : Observable<number> = this.cartItems$.pipe(
        map((items) => items.reduce((sum, item) => sum + item.price, 0)),
    );

    // Adds one product instance to cart state.
    addToCart(product: StoreV2Product): void {
        const nextItems = [...this.cartItemsSubject.value, product];
        this.cartItemsSubject.next(nextItems);
    }

    // Removes a single matching product instance by id.
    removeFromCart(productId: number): void {
        const index = this.cartItemsSubject.value.findIndex(
            (item) => item.id === productId,
        );

        if (index === -1) {
            return;
        }

        const nextItems = [...this.cartItemsSubject.value];
        nextItems.splice(index, 1);
        this.cartItemsSubject.next(nextItems);
    }

    // Clears all items from cart state.
    clearCart(): void {
        this.cartItemsSubject.next([]);
    }

    // shareReplay(1) caches the product list so we do not request it multiple times.
    private readonly products$: Observable<StoreV2Product[]> = this.http
        .get<StoreV2Product[]>("/assets/store-v2-products.json")
        .pipe(
            catchError(() => of(STORE_V2_PRODUCTS)), // use fallback data on error
            shareReplay(1),
        );

    constructor(private http: HttpClient) {}

    // Returns all products as an Observable for async UI updates.
    getProducts(): Observable<StoreV2Product[]> {
        return this.products$;
    }

    // Looks up a single product by id based on the loaded product list.
    getProductById(productId: number): Observable<StoreV2Product | undefined> {
        return this.products$.pipe(
            map((products) =>
                products.find((product) => product.id === productId),
            ),
        );
    }
}
