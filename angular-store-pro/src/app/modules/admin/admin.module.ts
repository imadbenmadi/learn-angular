import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Component } from "@angular/core";

@Component({
    selector: "app-admin",
    template:
        '<div class="container"><h2>Admin Dashboard</h2><p>Component coming soon...</p></div>',
    styles: [".container { padding: 2rem; }"],
})
export class AdminComponent {}

@NgModule({
    declarations: [AdminComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: "", component: AdminComponent }]),
    ],
})
export class AdminModule {}
