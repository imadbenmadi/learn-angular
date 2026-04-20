/**
 * auth.guard.ts
 * -------------
 * Route guard to protect authenticated pages.
 */

import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from "@angular/router";

import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

    canActivate(
        _route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): boolean | UrlTree {
        if (this.authService.hasToken()) {
            return true;
        }

        // Preserve the originally requested URL so we can redirect after login.
        return this.router.createUrlTree(["/auth/login"], {
            queryParams: { returnUrl: state.url },
        });
    }
}
