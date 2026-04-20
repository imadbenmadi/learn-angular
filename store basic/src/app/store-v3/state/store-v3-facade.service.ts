import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, map } from "rxjs";
import {
    StoreV3Product,
    StoreV3Category,
} from "../models/store-v3-product.model";
import { StoreV3ProductsService } from "../services/store-v3-products.service";

// A small "facade" service:
// - centralizes feature state
// - exposes read-only Observable streams for components
// - keeps components mostly declarative

export type StoreV3FilterCategory = "all" | StoreV3Category;

@Injectable({
    providedIn: "root",
})
export class StoreV3FacadeService {
    private readonly searchTermSubject = new BehaviorSubject<string>("");
    private readonly categorySubject =
        new BehaviorSubject<StoreV3FilterCategory>("all");

    readonly searchTerm$ = this.searchTermSubject.asObservable();
    readonly category$ = this.categorySubject.asObservable();

    readonly products$ = this.productsService.getProducts();

    // Derived view-model stream.
    readonly filteredProducts$ = combineLatest([
        this.products$,
        this.searchTerm$,
        this.category$,
    ]).pipe(
        map(([products, searchTerm, category]) =>
            this.applyFilters(products, searchTerm, category),
        ),
    );

    constructor(private productsService: StoreV3ProductsService) {}

    setSearchTerm(value: string): void {
        this.searchTermSubject.next(value);
    }

    setCategory(value: StoreV3FilterCategory): void {
        this.categorySubject.next(value);
    }

    private applyFilters(
        products: StoreV3Product[],
        searchTerm: string,
        category: StoreV3FilterCategory,
    ): StoreV3Product[] {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return products.filter((product) => {
            const matchesSearch =
                !normalizedSearch ||
                product.name.toLowerCase().includes(normalizedSearch) ||
                product.description.toLowerCase().includes(normalizedSearch) ||
                product.tags.some((tag) =>
                    tag.toLowerCase().includes(normalizedSearch),
                );

            const matchesCategory =
                category === "all" || product.category === category;

            return matchesSearch && matchesCategory;
        });
    }
}
