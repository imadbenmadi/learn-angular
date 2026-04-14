import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { HasPendingChanges } from "../guards/pending-changes.guard";
import { couponCodeValidator } from "./validators/coupon-code.validator";

// Typed forms (Angular 14+) are fully available in Angular 15.
// They improve safety by making control values strongly typed.

type CheckoutForm = FormGroup<{
    fullName: FormControl<string>;
    email: FormControl<string>;
    address: FormControl<string>;
    rating: FormControl<number>;
    coupon: FormControl<string>;
    acceptTerms: FormControl<boolean>;
}>;

@Component({
    selector: "app-store-v3-typed-forms",
    templateUrl: "./store-v3-typed-forms.component.html",
    styleUrls: ["./store-v3-typed-forms.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreV3TypedFormsComponent implements HasPendingChanges {
    submitted = false;

    // Note: FormBuilder.group(...) can infer types, but being explicit is clearer
    // for beginners.
    readonly form: CheckoutForm = this.formBuilder.group({
        fullName: this.formBuilder.nonNullable.control("", {
            validators: [Validators.required, Validators.minLength(3)],
        }),
        email: this.formBuilder.nonNullable.control("", {
            validators: [Validators.required, Validators.email],
        }),
        address: this.formBuilder.nonNullable.control("", {
            validators: [Validators.required, Validators.minLength(10)],
        }),
        rating: this.formBuilder.nonNullable.control(0, {
            validators: [Validators.min(1)],
        }),
        coupon: this.formBuilder.nonNullable.control("", {
            validators: [couponCodeValidator()],
        }),
        acceptTerms: this.formBuilder.nonNullable.control(false, {
            validators: [Validators.requiredTrue],
        }),
    });

    constructor(private formBuilder: FormBuilder) {}

    get fullName() {
        return this.form.controls.fullName;
    }

    get email() {
        return this.form.controls.email;
    }

    get address() {
        return this.form.controls.address;
    }

    get rating() {
        return this.form.controls.rating;
    }

    get coupon() {
        return this.form.controls.coupon;
    }

    get acceptTerms() {
        return this.form.controls.acceptTerms;
    }

    submit(): void {
        this.submitted = false;

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        // In real apps you would POST to an API here.
        // Keeping it local makes it easy to understand.
        this.submitted = true;
        this.form.markAsPristine();
    }

    reset(): void {
        this.submitted = false;
        this.form.reset({
            fullName: "",
            email: "",
            address: "",
            rating: 0,
            coupon: "",
            acceptTerms: false,
        });
    }

    hasPendingChanges(): boolean {
        // This method is used by CanDeactivate guard.
        return this.form.dirty && !this.submitted;
    }
}
