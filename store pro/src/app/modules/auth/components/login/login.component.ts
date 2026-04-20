import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs";
import { AuthService } from "../../../../services/auth.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"],
})
export class LoginComponent {
    form: FormGroup;
    isSubmitting = false;
    errorMessage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.form = this.fb.group({
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(6)]],
        });
    }

    submit(): void {
        this.errorMessage = null;

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;

        this.authService
            .login(this.form.value)
            .pipe(take(1))
            .subscribe({
                next: (resp) => {
                    if (!resp.success) {
                        this.errorMessage = resp.message || "Login failed.";
                        this.isSubmitting = false;
                        return;
                    }

                    const returnUrl =
                        this.route.snapshot.queryParamMap.get("returnUrl") ||
                        "/store";
                    this.router.navigateByUrl(returnUrl);
                },
                error: (err) => {
                    this.errorMessage =
                        err?.error?.message || "Invalid credentials.";
                    this.isSubmitting = false;
                },
                complete: () => {
                    this.isSubmitting = false;
                },
            });
    }
}
