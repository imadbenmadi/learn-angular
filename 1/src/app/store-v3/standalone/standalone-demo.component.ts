import {
    ChangeDetectionStrategy,
    Component,
    inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { StoreV3FacadeService } from "../state/store-v3-facade.service";

// Standalone components can be used without NgModules.
// In Angular 15 you can lazy-load them with Router's loadComponent().

@Component({
    standalone: true,
    selector: "app-standalone-demo",
    imports: [CommonModule],
    templateUrl: "./standalone-demo.component.html",
    styleUrls: ["./standalone-demo.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandaloneDemoComponent {
    // inject() is a function-based DI style.
    private readonly facade = inject(StoreV3FacadeService);

    readonly products$ = this.facade.products$;
    count = 0;

    inc(): void {
        this.count += 1;
    }
}
