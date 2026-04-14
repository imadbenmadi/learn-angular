// Store V3 uses its own model types so learners can compare approaches
// without mixing Store V2 code.

export type StoreV3Category = "phone" | "audio" | "wearable" | "accessory";

export interface StoreV3Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: StoreV3Category;
    inStock: number;
    rating: number;
    isFeatured: boolean;
    tags: string[];
}
