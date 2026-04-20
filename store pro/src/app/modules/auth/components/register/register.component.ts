import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { take } from "rxjs";
import { AuthService } from "../../../../services/auth.service";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
    form: FormGroup;
    isSubmitting = false;
    errorMessage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
    ) {
        this.form = this.fb.group({
            firstName: ["", [Validators.required]],
            lastName: ["", [Validators.required]],
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(6)]],
            confirmPassword: [
                "",
                [Validators.required, Validators.minLength(6)],
            ],
        });
    }

    submit(): void {
        this.errorMessage = null;

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (this.form.value.password !== this.form.value.confirmPassword) {
            this.errorMessage = "Passwords do not match.";
            return;
        }

        this.isSubmitting = true;

        this.authService
            .register(this.form.value)
            .pipe(take(1))
            .subscribe({
                next: (resp) => {
                    if (!resp.success) {
                        this.errorMessage =
                            resp.message || "Registration failed.";
                        this.isSubmitting = false;
                        return;
                    }
                    this.router.navigate(["/store"]);
                },
                error: (err) => {
                    this.errorMessage =
                        err?.error?.message || "Registration failed.";
                    this.isSubmitting = false;
                },
                complete: () => {
                    this.isSubmitting = false;
                },
            });
    }
}
