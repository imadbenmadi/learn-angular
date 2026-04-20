import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Product } from "../../../../models";
import { Router } from "@angular/router";

@Component({
    selector: "app-product-card",
    template: `
        <div class="product-card">
            <div class="product-image">
                <img
                    [src]="product.image"
                    [alt]="product.name"
                    (error)="onImageError($event)"
                />
                <span
                    class="badge"
                    *ngIf="
                        product.salePrice && product.salePrice < product.price
                    "
                    >Sale</span
                >
            </div>
            <div class="product-info">
                <h4>{{ product.name }}</h4>
                <p class="description">
                    {{ product.description | slice: 0 : 60 }}...
                </p>
                <div class="rating" *ngIf="product.rating">
                    ⭐ {{ product.rating }}/5
                </div>
                <div class="price-section">
                    <span class="price" *ngIf="!product.salePrice"
                        >₹{{ product.price }}</span
                    >
                    <span *ngIf="product.salePrice" class="original-price"
                        >₹{{ product.price }}</span
                    >
                    <span class="sale-price" *ngIf="product.salePrice"
                        >₹{{ product.salePrice }}</span
                    >
                </div>
                <div class="stock-status">
                    <span *ngIf="product.stock > 0" class="in-stock"
                        >In Stock</span
                    >
                    <span *ngIf="product.stock <= 0" class="out-of-stock"
                        >Out of Stock</span
                    >
                </div>
            </div>
            <div class="product-actions">
                <button
                    (click)="viewDetails()"
                    class="btn btn-secondary btn-sm"
                    style="width: 100%; margin-bottom: 0.5rem;"
                >
                    View Details
                </button>
                <button
                    (click)="onAddToCart()"
                    class="btn btn-primary btn-sm"
                    style="width: 100%;"
                    [disabled]="product.stock <= 0"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    `,
    styles: [
        `
            .product-card {
                background-color: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                overflow: hidden;
                transition: var(--transition);
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            .product-card:hover {
                box-shadow: var(--shadow-md);
                transform: translateY(-2px);
            }

            .product-image {
                position: relative;
                width: 100%;
                aspect-ratio: 1;
                overflow: hidden;
                background-color: var(--bg-secondary);
            }

            .product-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: var(--transition);
            }

            .product-card:hover .product-image img {
                transform: scale(1.1);
            }

            .badge {
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: var(--danger-color);
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: var(--border-radius);
                font-size: 0.75rem;
                font-weight: 600;
            }

            .product-info {
                padding: 1rem;
                flex: 1;
                display: flex;
                flex-direction: column;
            }

            .product-info h4 {
                margin: 0 0 0.5rem;
                font-size: 1rem;
                line-height: 1.3;
                color: var(--text-primary);
            }

            .description {
                font-size: 0.85rem;
                color: var(--text-secondary);
                margin-bottom: 0.5rem;
                flex: 1;
            }

            .rating {
                font-size: 0.85rem;
                margin-bottom: 0.5rem;
            }

            .price-section {
                margin: 0.75rem 0;
                font-weight: 600;
            }

            .price {
                font-size: 1.25rem;
                color: var(--primary-color);
            }

            .original-price {
                text-decoration: line-through;
                color: var(--text-secondary);
                margin-right: 0.5rem;
                font-size: 0.9rem;
            }

            .sale-price {
                font-size: 1.25rem;
                color: var(--danger-color);
            }

            .stock-status {
                margin-bottom: 0.75rem;
            }

            .in-stock {
                color: var(--success-color);
                font-size: 0.85rem;
                font-weight: 600;
            }

            .out-of-stock {
                color: var(--danger-color);
                font-size: 0.85rem;
                font-weight: 600;
            }

            .product-actions {
                padding: 1rem;
                border-top: 1px solid var(--border-color);
            }
        `,
    ],
})
export class ProductCardComponent {
    @Input() product!: Product;
    @Output() addToCart = new EventEmitter<Product>();

    constructor(private router: Router) {}

    onAddToCart(): void {
        this.addToCart.emit(this.product);
    }

    viewDetails(): void {
        this.router.navigate(["/store/product", this.product.id]);
    }

    onImageError(event: any): void {
        event.target.src = "https://via.placeholder.com/200?text=No+Image";
    }
}
