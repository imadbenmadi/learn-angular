import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Product } from "../../../../models";
import { CartService } from "../../../../services/cart.service";
import { ProductService } from "../../../../services/product.service";

@Component({
    selector: "app-product-details",
    templateUrl: "./product-details.component.html",
    styleUrls: ["./product-details.component.css"],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
    product: Product | null = null;
    isLoading = false;
    errorMessage: string | null = null;
    message: string | null = null;

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService,
        private cartService: CartService,
    ) {}

    ngOnInit(): void {
        this.route.paramMap
            .pipe(takeUntil(this.destroy$))
            .subscribe((params) => {
                const id = params.get("id");
                if (!id) {
                    this.errorMessage = "Invalid product id.";
                    return;
                }
                this.loadProduct(id);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadProduct(id: string): void {
        this.isLoading = true;
        this.errorMessage = null;
        this.product = null;

        this.productService
            .getProductById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.product = response.data || null;
                    if (!this.product) {
                        this.errorMessage = "Product not found.";
                    }
                    this.isLoading = false;
                },
                error: () => {
                    this.errorMessage = "Failed to load product.";
                    this.isLoading = false;
                },
            });
    }

    addToCart(): void {
        if (!this.product) return;
        this.cartService.addToCart(this.product, 1);
        this.message = "Added to cart.";
        window.setTimeout(() => (this.message = null), 2000);
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement | null;
        if (img) {
            img.src = "https://via.placeholder.com/600?text=No+Image";
        }
    }

    goBack(): void {
        this.router.navigate(["/store"]);
    }

    getDisplayPrice(p: Product): number {
        return p.salePrice && p.salePrice < p.price ? p.salePrice : p.price;
    }
}
