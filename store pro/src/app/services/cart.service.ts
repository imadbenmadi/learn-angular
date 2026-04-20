import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Cart, CartItem, Product } from "../models";

@Injectable({
    providedIn: "root",
})
export class CartService {
    private cartSubject = new BehaviorSubject<Cart>({
        items: [],
        totalItems: 0,
        totalPrice: 0,
    });

    public cart$ = this.cartSubject.asObservable();
    private readonly STORAGE_KEY = "app_cart";

    constructor() {
        this.loadCart();
    }

    /**
     * Load cart from localStorage
     */
    private loadCart(): void {
        const savedCart = localStorage.getItem(this.STORAGE_KEY);
        if (savedCart) {
            try {
                const cart = JSON.parse(savedCart);
                this.cartSubject.next(cart);
            } catch (e) {
                console.error("Error loading cart from storage:", e);
                this.clearCart();
            }
        }
    }

    /**
     * Save cart to localStorage
     */
    private saveCart(): void {
        const cart = this.cartSubject.getValue();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    }

    /**
     * Add product to cart
     */
    addToCart(product: Product, quantity: number = 1): void {
        const cart = this.cartSubject.getValue();
        const existingItem = cart.items.find(
            (item) => item.product.id === product.id,
        );

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.totalPrice =
                existingItem.product.price * existingItem.quantity;
        } else {
            cart.items.push({
                product,
                quantity,
                totalPrice: product.price * quantity,
            });
        }

        this.updateCart(cart);
    }

    /**
     * Remove product from cart
     */
    removeFromCart(productId: string): void {
        const cart = this.cartSubject.getValue();
        cart.items = cart.items.filter((item) => item.product.id !== productId);
        this.updateCart(cart);
    }

    /**
     * Update product quantity in cart
     */
    updateQuantity(productId: string, quantity: number): void {
        const cart = this.cartSubject.getValue();
        const item = cart.items.find((i) => i.product.id === productId);

        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                item.totalPrice = item.product.price * quantity;
                this.updateCart(cart);
            }
        }
    }

    /**
     * Clear entire cart
     */
    clearCart(): void {
        this.cartSubject.next({
            items: [],
            totalItems: 0,
            totalPrice: 0,
        });
        this.saveCart();
    }

    /**
     * Update cart totals and save
     */
    private updateCart(cart: Cart): void {
        cart.totalItems = cart.items.reduce(
            (total, item) => total + item.quantity,
            0,
        );
        cart.totalPrice = cart.items.reduce(
            (total, item) => total + item.totalPrice,
            0,
        );
        this.cartSubject.next(cart);
        this.saveCart();
    }

    /**
     * Get current cart
     */
    getCart(): Observable<Cart> {
        return this.cart$;
    }

    /**
     * Get cart snapshot
     */
    getCartSnapshot(): Cart {
        return this.cartSubject.getValue();
    }

    /**
     * Get cart items
     */
    getCartItems(): CartItem[] {
        return this.cartSubject.getValue().items;
    }

    /**
     * Get total items count
     */
    getTotalItems(): number {
        return this.cartSubject.getValue().totalItems;
    }

    /**
     * Get total price
     */
    getTotalPrice(): number {
        return this.cartSubject.getValue().totalPrice;
    }

    /**
     * Check if product is in cart
     */
    isInCart(productId: string): boolean {
        return this.cartSubject
            .getValue()
            .items.some((item) => item.product.id === productId);
    }

    /**
     * Get quantity of product in cart
     */
    getProductQuantity(productId: string): number {
        const item = this.cartSubject
            .getValue()
            .items.find((i) => i.product.id === productId);
        return item ? item.quantity : 0;
    }
}
