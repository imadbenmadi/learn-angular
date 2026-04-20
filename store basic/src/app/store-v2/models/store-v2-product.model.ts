// This type keeps product categories constrained to known values.
export type StoreV2Category = "phone" | "audio" | "wearable" | "accessory";

// This interface is the shape of one product in Store V2.
export interface StoreV2Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: StoreV2Category;
    inStock: number;
    rating: number;
    isFeatured: boolean;
    tags: string[];
}
