import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "./services/auth.service";
import { CartService } from "./services/cart.service";
import { User } from "./models";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
    title = "Professional Angular Store";
    showUserMenu = false;

    // Observables from services
    currentUser$: Observable<User | null>;
    isAuthenticated$: Observable<boolean>;
    isAdmin$: Observable<boolean>;
    cartTotalItems$: Observable<number>;

    constructor(
        private authService: AuthService,
        private cartService: CartService,
    ) {
        // Initialize observables from services
        this.currentUser$ = this.authService.getCurrentUser();
        this.isAuthenticated$ = this.authService.isAuthenticated$;
        this.isAdmin$ = this.authService.isAuthenticated$.pipe(
            map(() => this.authService.isAdmin()),
        );
        this.cartTotalItems$ = this.cartService.cart$.pipe(
            map((cart) => cart.totalItems),
        );
    }

    ngOnInit(): void {
        // Verify token on app initialization
        if (this.authService.isAuthenticated()) {
            this.authService.verifyToken().subscribe(
                () => console.log("Token verified"),
                (error) => {
                    console.error("Token verification failed:", error);
                    this.authService.logout();
                },
            );
        }
    }

    /**
     * Toggle user menu
     */
    toggleUserMenu(): void {
        this.showUserMenu = !this.showUserMenu;
    }

    /**
     * Logout user
     */
    logout(): void {
        this.authService.logout();
        this.showUserMenu = false;
    }
}
