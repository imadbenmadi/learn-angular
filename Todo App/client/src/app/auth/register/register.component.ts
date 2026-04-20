/**
 * register.component.ts
 * ---------------------
 * Registration screen (name/email/password).
 */

import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";

import { AuthService } from "../../core/services/auth.service";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
    public isSubmitting = false;
    public errorMessage: string | null = null;

    public readonly form = this.fb.group({
        name: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(8)]],
    });

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
    ) {}

    public submit(): void {
        this.errorMessage = null;

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const name = this.form.value.name!;
        const email = this.form.value.email!;
        const password = this.form.value.password!;

        this.isSubmitting = true;

        this.authService
            .register(name, email, password)
            .pipe(finalize(() => (this.isSubmitting = false)))
            .subscribe({
                next: () => {
                    // After register, we already have a token (server returns token + user)
                    this.router.navigate(["/tasks"]);
                },
                error: (err) => {
                    this.errorMessage = err?.message ?? "Registration failed";
                },
            });
    }
}
