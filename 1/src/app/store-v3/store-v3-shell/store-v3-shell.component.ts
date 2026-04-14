import { Component } from "@angular/core";

@Component({
    selector: "app-store-v3-shell",
    templateUrl: "./store-v3-shell.component.html",
    styleUrls: ["./store-v3-shell.component.css"],
})
export class StoreV3ShellComponent {
    // Store V3 is designed to show Angular 15-era "advanced" patterns.
    // It uses:
    // - lazy loaded feature module
    // - route resolvers
    // - canDeactivate guard
    // - typed reactive forms + custom ControlValueAccessor
    // - a standalone component route (loadComponent)
}
