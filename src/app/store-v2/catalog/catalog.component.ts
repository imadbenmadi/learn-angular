import { Component } from "@angular/core";
import { BehaviorSubject, combineLatest, map } from "rxjs";
import {
    StoreV2Category,
    StoreV2Product,
} from "../models/store-v2-product.model";
import { StoreV2Service } from "../services/store-v2.service";

type CatalogFilterCategory = "all" | StoreV2Category;

@Component({
    selector: "app-catalog",
    templateUrl: "./catalog.component.html",
    styleUrls: ["./catalog.component.css"],
})
export class CatalogComponent {
    // Local state for ngModel inputs in the template.
    searchTerm = "";
    selectedCategory: CatalogFilterCategory = "all";

    // Subjects represent the same state as streams so we can combine/filter reactively.
    private readonly searchTermSubject = new BehaviorSubject<string>("");
    private readonly categorySubject =
        new BehaviorSubject<CatalogFilterCategory>("all");

    // Product data stream comes from the service (HTTP + fallback).
    readonly products$ = this.storeV2Service.getProducts();

    // Small observable to show how many items are in cart.
    readonly cartCount$ = this.storeV2Service.cartItems$.pipe(
        map((items) => items.length),
    );

    // Reactive filtering: whenever products/search/category changes, list recomputes.
    readonly filteredProducts$ = combineLatest([
        this.products$,
        this.searchTermSubject,
        this.categorySubject,
    ]).pipe(
        map(([products, searchTerm, selectedCategory]) => {
            const normalizedSearch = searchTerm.trim().toLowerCase();

            return products.filter((product) => {
                const matchesSearch =
                    !normalizedSearch ||
                    product.name.toLowerCase().includes(normalizedSearch) ||
                    product.description
                        .toLowerCase()
                        .includes(normalizedSearch) ||
                    product.tags.some((tag) =>
                        tag.toLowerCase().includes(normalizedSearch),
                    );

                const matchesCategory =
                    selectedCategory === "all" ||
                    product.category === selectedCategory;

                return matchesSearch && matchesCategory;
            });
        }),
    );

    // This drives the category select options.
    readonly categories: CatalogFilterCategory[] = [
        "all",
        "phone",
        "audio",
        "wearable",
        "accessory",
    ];

    constructor(private storeV2Service: StoreV2Service) {}

    setSearchTerm(value: string): void {
        this.searchTerm = value;
        this.searchTermSubject.next(value);
    }

    setCategory(value: string): void {
        const category = value as CatalogFilterCategory;
        this.selectedCategory = category;
        this.categorySubject.next(category);
    }

    addToCart(product: StoreV2Product): void {
        this.storeV2Service.addToCart(product);
    }

    trackByProductId(index: number, product: StoreV2Product): number {
        void index;
        return product.id;
    }
}
