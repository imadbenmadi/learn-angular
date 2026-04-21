import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { Cart, CartItem } from "../../../../models";
import { CartService } from "../../../../services/cart.service";

@Component({
    selector: "app-cart",
    templateUrl: "./cart.component.html",
    styleUrls: ["./cart.component.css"],
})
export class CartComponent {
    cart$: Observable<Cart>;

    constructor(
        private cartService: CartService,
        private router: Router,
    ) {
        this.cart$ = this.cartService.cart$;
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement | null;
        if (!img) return;

        if (img.dataset["fallbackApplied"] === "1") return;
        img.dataset["fallbackApplied"] = "1";

        img.src = "/api/images/placeholder?w=80&h=80&text=No%20Image";
    }

    trackByProductId(_: number, item: CartItem): string {
        return item.product.id || item.product._id || item.product.sku;
    }

    updateQuantity(productId: string | undefined, quantityValue: string): void {
        if (!productId) return;
        const quantity = Number(quantityValue);
        this.cartService.updateQuantity(
            productId,
            Number.isFinite(quantity) ? quantity : 1,
        );
    }

    remove(productId: string | undefined): void {
        if (!productId) return;
        this.cartService.removeFromCart(productId);
    }

    clear(): void {
        this.cartService.clearCart();
    }

    continueShopping(): void {
        this.router.navigate(["/store"]);
    }

    checkout(cart: Cart): void {
        if (!cart.items.length) return;
        this.router.navigate(["/store/checkout"]);
    }
}
