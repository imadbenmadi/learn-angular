/**
 * app.component.ts
 * ---------------
 * Shell component.
 *
 * We initialize auth state here (load user from token if present).
 */

import { Component, OnInit } from "@angular/core";

import { AuthService } from "./core/services/auth.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        // If a token exists in localStorage, validate it by calling /auth/me.
        // This makes refresh (F5) behave like a real app.
        this.authService.initFromStorage().subscribe();
    }
}
