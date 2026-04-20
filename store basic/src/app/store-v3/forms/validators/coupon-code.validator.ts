import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// Example custom validator:
// - Accepts empty (optional field)
// - If present, must match pattern "SAVE-1234"

const COUPON_PATTERN = /^SAVE-\d{4}$/;

export function couponCodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = String(control.value ?? "").trim();

        if (!value) {
            return null;
        }

        if (!COUPON_PATTERN.test(value)) {
            return { couponFormat: "Use format SAVE-1234" };
        }

        return null;
    };
}
