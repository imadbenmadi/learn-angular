import {
    Directive,
    ElementRef,
    Input,
    OnChanges,
    Renderer2,
    SimpleChanges,
} from "@angular/core";

@Directive({
    selector: "[appSpotlight]",
})
export class SpotlightDirective implements OnChanges {
    // Input value comes from [appSpotlight]="product.inStock" in templates.
    @Input("appSpotlight") inStock = 0;

    constructor(
        private element: ElementRef<HTMLElement>,
        private renderer: Renderer2,
    ) {}

    // This hook runs whenever the inStock input changes.
    ngOnChanges(changes: SimpleChanges): void {
        if (!("inStock" in changes)) {
            return;
        }

        const borderColor =
            this.inStock <= 0
                ? "#d32f2f"
                : this.inStock < 5
                  ? "#f9a825"
                  : "#2e7d32";

        const backgroundColor =
            this.inStock <= 0
                ? "#ffebee"
                : this.inStock < 5
                  ? "#fff8e1"
                  : "#e8f5e9";

        this.renderer.setStyle(
            this.element.nativeElement,
            "border",
            `1px solid ${borderColor}`,
        );
        this.renderer.setStyle(
            this.element.nativeElement,
            "background-color",
            backgroundColor,
        );
        this.renderer.setStyle(
            this.element.nativeElement,
            "border-radius",
            "8px",
        );
        this.renderer.setStyle(this.element.nativeElement, "padding", "12px");
    }
}
