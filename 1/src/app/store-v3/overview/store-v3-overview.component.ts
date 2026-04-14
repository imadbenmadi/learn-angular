import {
    ChangeDetectionStrategy,
    Component,
} from "@angular/core";
import { StoreV3FacadeService } from "../state/store-v3-facade.service";
import { StoreV3FilterCategory } from "../state/store-v3-facade.service";
import { StoreV3Product } from "../models/store-v3-product.model";

@Component({
    selector: "app-store-v3-overview",
    templateUrl: "./store-v3-overview.component.html",
    styleUrls: ["./store-v3-overview.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreV3OverviewComponent {
    // OnPush + async pipe is the simplest performance win:
    // - UI updates when Observable emits
    // - avoids manual subscription management

    readonly filteredProducts$ = this.facade.filteredProducts$;

    // These are used for template inputs.
    searchTerm = "";
    selectedCategory: StoreV3FilterCategory = "all";

    readonly categories: StoreV3FilterCategory[] = [
        "all",
        "phone",
        "audio",
        "wearable",
        "accessory",
    ];

    constructor(private facade: StoreV3FacadeService) {}

    setSearchTerm(value: string): void {
        this.searchTerm = value;
        this.facade.setSearchTerm(value);
    }

    setCategory(value: string): void {
        // Keep it simple for learners: cast from select value.
        const category = value as StoreV3FilterCategory;
        this.selectedCategory = category;
        this.facade.setCategory(category);
    }

    trackByProductId(index: number, product: StoreV3Product): number {
        void index;
        return product.id;
    }
}
