import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Component } from "@angular/core";

@Component({
    selector: "app-profile",
    template:
        '<div class="container"><h2>User Profile</h2><p>Component coming soon...</p></div>',
    styles: [".container { padding: 2rem; }"],
})
export class ProfileComponent {}

@NgModule({
    declarations: [ProfileComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: "", component: ProfileComponent }]),
    ],
})
export class ProfileModule {}
