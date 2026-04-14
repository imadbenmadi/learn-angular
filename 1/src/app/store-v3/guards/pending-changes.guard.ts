import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";

// Use a small interface so any component can opt-in to this guard.
export interface HasPendingChanges {
    hasPendingChanges(): boolean;
}

@Injectable({
    providedIn: "root",
})
export class PendingChangesGuard implements CanDeactivate<HasPendingChanges> {
    canDeactivate(component: HasPendingChanges): boolean {
        // In real apps you may show a custom dialog.
        // For a learning project, `confirm` is simple and built-in.
        if (!component.hasPendingChanges()) {
            return true;
        }

        return window.confirm(
            "You have unsaved changes. Leave this page anyway?",
        );
    }
}
