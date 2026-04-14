import { InjectionToken } from "@angular/core";

// InjectionToken is the Angular way to provide non-class dependencies.
// It avoids magic strings and makes values type-safe.

export const STORE_V3_PRODUCTS_URL = new InjectionToken<string>(
    "STORE_V3_PRODUCTS_URL",
);
