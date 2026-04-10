import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { map } from "rxjs";
import { StoreV2Product } from "../models/store-v2-product.model";
import { StoreV2Service } from "../services/store-v2.service";

@Component({
    selector: "app-cart-v2",
    templateUrl: "./cart-v2.component.html",
    styleUrls: ["./cart-v2.component.css"],
})
export class CartV2Component {
    // Data streams coming from service.
    readonly items$ = this.storeV2Service.cartItems$;
    readonly total$ = this.storeV2Service.cartTotal$;
    readonly hasItems$ = this.items$.pipe(map((items) => items.length > 0));

    // UI flag to show a success message after submit.
    orderPlaced = false;

    // Reactive Form setup with validation rules.
    checkoutForm = this.formBuilder.group({
        fullName: ["", [Validators.required, Validators.minLength(3)]],
        email: ["", [Validators.required, Validators.email]],
        address: ["", [Validators.required, Validators.minLength(10)]],
        shippingType: ["standard", Validators.required],
        notes: [""],
    });

    constructor(
        private storeV2Service: StoreV2Service,
        private formBuilder: FormBuilder,
    ) {}

    // These getters make validation expressions easier to read in template.
    get fullNameControl() {
        return this.checkoutForm.controls.fullName;
    }

    get emailControl() {
        return this.checkoutForm.controls.email;
    }

    get addressControl() {
        return this.checkoutForm.controls.address;
    }

    removeItem(productId: number): void {
        this.storeV2Service.removeFromCart(productId);
    }

    submitOrder(): void {
        if (this.checkoutForm.invalid) {
            this.checkoutForm.markAllAsTouched();
            return;
        }

        this.storeV2Service.clearCart();
        this.orderPlaced = true;

        this.checkoutForm.reset({
            fullName: "",
            email: "",
            address: "",
            shippingType: "standard",
            notes: "",
        });
    }

    trackByCartItem(index: number, product: StoreV2Product): number {
        // We include index so duplicate product ids can still render uniquely.
        return product.id + index;
    }
}
