import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthRoutingModule } from "./auth-routing.module";

// Stub components for now
import { Component } from "@angular/core";

@Component({
    selector: "app-login",
    template:
        '<div class="container"><h2>Login</h2><p>Component coming soon...</p></div>',
    styles: [".container { padding: 2rem; }"],
})
export class LoginComponent {}

@Component({
    selector: "app-register",
    template:
        '<div class="container"><h2>Register</h2><p>Component coming soon...</p></div>',
    styles: [".container { padding: 2rem; }"],
})
export class RegisterComponent {}

@NgModule({
    declarations: [LoginComponent, RegisterComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AuthRoutingModule,
    ],
})
export class AuthModule {}
