import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class StoreV2EnterGuard {
    constructor(private router: Router) {}

    // Guard example: blocks access when ?locked=true is present in URL.
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): boolean | UrlTree {
        const isLocked = route.queryParamMap.get("locked") === "true";

        if (isLocked) {
            console.warn(
                "Store V2 is locked by query parameter. Redirecting to home.",
                state.url,
            );
            return this.router.parseUrl("/");
        }

        return true;
    }
}
