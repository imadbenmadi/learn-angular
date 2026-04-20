import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "stockLevel",
})
export class StockLevelPipe implements PipeTransform {
    // Custom pipe: converts a number into friendly stock status text.
    transform(inStock: number): string {
        if (inStock <= 0) {
            return "Out of stock";
        }

        if (inStock < 5) {
            return `Low stock (${inStock} left)`;
        }

        return `In stock (${inStock} available)`;
    }
}
