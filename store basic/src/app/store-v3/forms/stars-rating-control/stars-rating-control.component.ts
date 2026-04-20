import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    forwardRef,
    Input,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

// A tiny custom form control demonstrating ControlValueAccessor.
// It integrates with Reactive Forms and supports disabled state.

@Component({
    selector: "app-stars-rating-control",
    templateUrl: "./stars-rating-control.component.html",
    styleUrls: ["./stars-rating-control.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => StarsRatingControlComponent),
            multi: true,
        },
    ],
})
export class StarsRatingControlComponent implements ControlValueAccessor {
    @Input() max = 5;

    value = 0;
    disabled = false;

    constructor(private cdr: ChangeDetectorRef) {}

    // These callbacks are provided by Angular forms.
    private onChange: (value: number) => void = () => {};
    private onTouched: () => void = () => {};

    writeValue(value: number | null): void {
        this.value = value ?? 0;
        this.cdr.markForCheck();
    }

    registerOnChange(fn: (value: number) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.cdr.markForCheck();
    }

    setValue(next: number): void {
        if (this.disabled) {
            return;
        }

        this.value = next;
        this.onChange(next);
        this.onTouched();
        this.cdr.markForCheck();
    }

    stars(): number[] {
        return Array.from({ length: this.max }, (_, i) => i + 1);
    }
}
