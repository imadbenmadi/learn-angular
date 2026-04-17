/**
 * core.module.ts
 * --------------
 * Singleton services and cross-cutting concerns.
 *
 * Pattern:
 * - Import CoreModule ONLY in AppModule
 * - Keep feature modules (Auth/Tasks) focused
 */

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule, Optional, SkipSelf } from "@angular/core";

import { AuthInterceptor } from "./interceptors/auth.interceptor";

@NgModule({
    imports: [HttpClientModule],
    providers: [
        // Interceptors are provided as multi providers
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
    ],
})
export class CoreModule {
    // Defensive check: CoreModule should not be imported twice.
    constructor(@Optional() @SkipSelf() parentModule: CoreModule | null) {
        if (parentModule) {
            throw new Error(
                "CoreModule is already loaded. Import it in AppModule only.",
            );
        }
    }
}
