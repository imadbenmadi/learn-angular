/**
 * login.component.ts
 * ------------------
 * Reactive form example + calling AuthService.login().
 */

import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";

import { AuthService } from "../../core/services/auth.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
    public isSubmitting = false;
    public errorMessage: string | null = null;

    public readonly form = this.fb.group({
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required]],
    });

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    public submit(): void {
        this.errorMessage = null;

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const email = this.form.value.email!;
        const password = this.form.value.password!;

        this.isSubmitting = true;

        this.authService
            .login(email, password)
            .pipe(finalize(() => (this.isSubmitting = false)))
            .subscribe({
                next: () => {
                    const returnUrl =
                        this.route.snapshot.queryParamMap.get("returnUrl") ??
                        "/tasks";
                    this.router.navigateByUrl(returnUrl);
                },
                error: (err) => {
                    // API errors are returned as: { error: { message: string } }
                    this.errorMessage =
                        err?.error?.error?.message ?? "Login failed";
                },
            });
    }
}
