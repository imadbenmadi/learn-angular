import { Component, EventEmitter, Input, Output } from "@angular/core";
import { StoreV2Product } from "../models/store-v2-product.model";

@Component({
    selector: "app-product-tile",
    templateUrl: "./product-tile.component.html",
    styleUrls: ["./product-tile.component.css"],
})
export class ProductTileComponent {
    // @Input allows parent component to pass product data into this child component.
    @Input() product!: StoreV2Product;

    // @Output allows child component to notify parent when user clicks Add.
    @Output() add = new EventEmitter<StoreV2Product>();

    onAddClicked(): void {
        this.add.emit(this.product);
    }
}
