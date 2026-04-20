/**
 * environment.prod.ts
 * -------------------
 * Production environment values.
 *
 * Example idea:
 * - If your Angular app and API are deployed together, you can use a relative URL.
 */

export const environment = {
    production: true,

    // If hosting behind the same domain, you can use '/api'.
    apiBaseUrl: "/api",
};
