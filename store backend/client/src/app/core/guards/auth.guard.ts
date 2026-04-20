/**
 * auth.guard.ts
 * -------------
 * Route guard to protect authenticated pages.
 */

import { inject } from "@angular/core";
import {
    CanActivateFn,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from "@angular/router";

import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = (
    _route,
    state: RouterStateSnapshot,
): boolean | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.hasToken()) {
        return true;
    }

    // Preserve the originally requested URL so we can redirect after login.
    return router.createUrlTree(["/auth/login"], {
        queryParams: { returnUrl: state.url },
    });
};
