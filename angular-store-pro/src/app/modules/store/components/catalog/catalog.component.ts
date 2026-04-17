import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ProductService } from "../../../../services/product.service";
import { CartService } from "../../../../services/cart.service";
import { Product, Category } from "../../../../models";

@Component({
    selector: "app-store-catalog",
    templateUrl: "./catalog.component.html",
    styleUrls: ["./catalog.component.css"],
})
export class StoreCatalogComponent implements OnInit, OnDestroy {
    products: Product[] = [];
    categories: Category[] = [];
    filteredProducts: Product[] = [];

    // Pagination
    currentPage = 1;
    itemsPerPage = 12;
    totalItems = 0;

    // Filters
    selectedCategory: string = "";
    searchQuery: string = "";
    sortBy: string = "name"; // name, price-low, price-high, rating

    // Loading state
    isLoading = false;

    private destroy$ = new Subject<void>();

    constructor(
        private productService: ProductService,
        private cartService: CartService,
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.loadCategories();
        this.loadProducts();

        // Listen to route params
        this.activatedRoute.queryParams
            .pipe(takeUntil(this.destroy$))
            .subscribe((params) => {
                this.selectedCategory = params["category"] || "";
                this.searchQuery = params["search"] || "";
                this.currentPage = params["page"]
                    ? parseInt(params["page"])
                    : 1;
                this.applyFilters();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Load categories
     */
    loadCategories(): void {
        this.productService.getCategories().subscribe(
            (response) => {
                if (response.data) {
                    this.categories = response.data;
                }
            },
            (error) => console.error("Error loading categories:", error),
        );
    }

    /**
     * Load products
     */
    loadProducts(): void {
        this.isLoading = true;
        const offset = (this.currentPage - 1) * this.itemsPerPage;

        this.productService
            .getProducts(
                this.itemsPerPage,
                offset,
                this.selectedCategory,
                this.searchQuery,
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (response) => {
                    this.products = response.data;
                    this.totalItems = response.pagination.total;
                    this.applyFilters();
                    this.isLoading = false;
                },
                (error) => {
                    console.error("Error loading products:", error);
                    this.isLoading = false;
                },
            );
    }

    /**
     * Apply filters and sorting
     */
    applyFilters(): void {
        this.filteredProducts = [...this.products];

        // Apply sorting
        switch (this.sortBy) {
            case "price-low":
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                this.filteredProducts.sort(
                    (a, b) => (b.rating || 0) - (a.rating || 0),
                );
                break;
            default: // name
                this.filteredProducts.sort((a, b) =>
                    a.name.localeCompare(b.name),
                );
        }
    }

    /**
     * Filter by category
     */
    filterByCategory(category: string): void {
        this.selectedCategory = category;
        this.currentPage = 1;
        this.loadProducts();
    }

    /**
     * Search products
     */
    search(): void {
        this.currentPage = 1;
        this.loadProducts();
    }

    /**
     * Change sort option
     */
    changeSortBy(sort: string): void {
        this.sortBy = sort;
        this.applyFilters();
    }

    /**
     * Go to next page
     */
    nextPage(): void {
        const maxPages = Math.ceil(this.totalItems / this.itemsPerPage);
        if (this.currentPage < maxPages) {
            this.currentPage++;
            this.loadProducts();
        }
    }

    /**
     * Go to previous page
     */
    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadProducts();
        }
    }

    /**
     * Add product to cart
     */
    addToCart(product: Product): void {
        this.cartService.addToCart(product, 1);
        alert(`${product.name} added to cart!`);
    }

    /**
     * Get total pages
     */
    getTotalPages(): number {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }
}
