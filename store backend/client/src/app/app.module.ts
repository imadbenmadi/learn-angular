/**
 * app.module.ts
 * ------------
 * Root NgModule.
 *
 * You asked for:
 * - Angular v15 (NgModule-based, NOT standalone)
 * - Constructor-based DI
 *
 * This file is the "entry" module that pulls everything together.
 */

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { NotFoundComponent } from "./not-found/not-found.component";
import { SharedModule } from "./shared/shared.module";

@NgModule({
    declarations: [AppComponent, NotFoundComponent],
    imports: [BrowserModule, CoreModule, SharedModule, AppRoutingModule],
    bootstrap: [AppComponent],
})
export class AppModule {}
