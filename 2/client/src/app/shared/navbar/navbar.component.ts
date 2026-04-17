/**
 * navbar.component.ts
 * -------------------
 * Bootstrap navbar.
 *
 * Shows:
 * - Tasks link when logged in
 * - Login/Register links when logged out
 */

import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../../core/services/auth.service";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
    public readonly user$ = this.authService.user$;

    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

    public logout(): void {
        this.authService.logout();
        this.router.navigate(["/auth/login"]);
    }
}
