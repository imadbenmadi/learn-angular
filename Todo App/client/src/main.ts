/**
 * main.ts
 * -------
 * Angular 15 bootstrap (NgModule version).
 *
 * NOTE: This is NOT the standalone bootstrap style.
 * We intentionally bootstrap AppModule to match your learning request.
 */

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
