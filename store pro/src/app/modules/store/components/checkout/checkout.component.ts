import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, take } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Cart, Order } from "../../../../models";
import { CartService } from "../../../../services/cart.service";
import { OrderService } from "../../../../services/order.service";

@Component({
    selector: "app-checkout",
    templateUrl: "./checkout.component.html",
    styleUrls: ["./checkout.component.css"],
})
export class CheckoutComponent implements OnDestroy {
    form: FormGroup;
    cart: Cart | null = null;

    step: "details" | "payment" = "details";

    isSubmitting = false;
    errorMessage: string | null = null;
    successMessage: string | null = null;

    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private cartService: CartService,
        private orderService: OrderService,
        private router: Router,
    ) {
        this.form = this.fb.group({
            firstName: ["", [Validators.required]],
            lastName: ["", [Validators.required]],
            email: ["", [Validators.required, Validators.email]],
            phone: ["", [Validators.required]],
            street: ["", [Validators.required]],
            city: ["", [Validators.required]],
            state: ["", [Validators.required]],
            postalCode: ["", [Validators.required]],
            country: ["", [Validators.required]],
            paymentMethod: ["credit_card", [Validators.required]],
        });

        this.cartService.cart$
            .pipe(takeUntil(this.destroy$))
            .subscribe((cart) => (this.cart = cart));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    continueToPayment(): void {
        this.errorMessage = null;
        this.successMessage = null;

        if (!this.cart || this.cart.items.length === 0) {
            this.errorMessage = "Your cart is empty.";
            return;
        }

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.errorMessage = "Please complete the required fields.";
            return;
        }

        this.step = "payment";
    }

    backToDetails(): void {
        this.errorMessage = null;
        this.successMessage = null;
        this.step = "details";
    }

    payNow(): void {
        this.errorMessage = null;
        this.successMessage = null;

        if (!this.cart || this.cart.items.length === 0) {
            this.errorMessage = "Your cart is empty.";
            this.step = "details";
            return;
        }

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.errorMessage = "Please complete the required fields.";
            this.step = "details";
            return;
        }

        this.isSubmitting = true;

        // Static payment gateway simulation (no real payment provider).
        // Keep it deterministic for demo: always succeeds after a short delay.
        window.setTimeout(() => {
            const order = this.buildOrderPayload();

            this.orderService
                .createOrder(order)
                .pipe(take(1))
                .subscribe({
                    next: () => {
                        this.cartService.clearCart();
                        this.successMessage =
                            "Payment successful. Order placed successfully.";
                        this.isSubmitting = false;
                        window.setTimeout(
                            () => this.router.navigate(["/store"]),
                            1200,
                        );
                    },
                    error: (err) => {
                        this.errorMessage =
                            err?.error?.message ||
                            "Failed to place order. Please try again.";
                        this.isSubmitting = false;
                        this.step = "details";
                    },
                });
        }, 600);
    }

    private buildOrderPayload(): Order {
        const v = this.form.value;

        const order: Order = {
            userId: "", // backend sets this from JWT
            items: (this.cart?.items || []).map((item) => ({
                productId: (item.product.id || item.product._id) as string,
                productName: item.product.name,
                price: item.product.salePrice || item.product.price,
                quantity: item.quantity,
                totalPrice:
                    (item.product.salePrice || item.product.price) *
                    item.quantity,
            })),
            totalAmount: this.cart?.totalPrice || 0,
            shippingAddress: {
                firstName: v.firstName,
                lastName: v.lastName,
                email: v.email,
                phone: v.phone,
                street: v.street,
                city: v.city,
                state: v.state,
                postalCode: v.postalCode,
                country: v.country,
            },
            status: "pending" as any,
            paymentMethod: v.paymentMethod,
        };

        // Mark as paid in the demo gateway so admin revenue metrics can work once delivered.
        (order as any).paymentStatus = "completed";

        return order;
    }

    goToCart(): void {
        this.router.navigate(["/store/cart"]);
    }
}
