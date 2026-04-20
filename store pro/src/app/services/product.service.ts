import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Product, ApiResponse, PaginatedResponse, Category } from "../models";

@Injectable({
    providedIn: "root",
})
export class ProductService {
    private apiUrl = "/api/products";
    private productsSubject = new BehaviorSubject<Product[]>([]);
    public products$ = this.productsSubject.asObservable();

    private selectedProductSubject = new BehaviorSubject<Product | null>(null);
    public selectedProduct$ = this.selectedProductSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadProducts();
    }

    private normalizeProduct(product: Product): Product {
        if (!product) return product;

        const normalized: Product = {
            ...product,
            id: product.id || product._id,
        };

        // If backend populated the category, ensure it also has an id
        const categoryAny: any = (normalized as any).category;
        if (categoryAny && typeof categoryAny === "object") {
            (normalized as any).category = {
                ...categoryAny,
                id: categoryAny.id || categoryAny._id,
            };
        }

        return normalized;
    }

    private normalizeCategory(category: Category): Category {
        if (!category) return category;
        return {
            ...category,
            id: category.id || category._id,
        };
    }

    /**
     * Load all products
     */
    loadProducts(): void {
        this.getProducts().subscribe(
            (response: PaginatedResponse<Product>) => {
                if (response.data) {
                    this.productsSubject.next(response.data);
                }
            },
            (error) => console.error("Error loading products:", error),
        );
    }

    /**
     * Get all products with pagination and filtering
     */
    getProducts(
        limit: number = 20,
        offset: number = 0,
        category?: string,
        search?: string,
        includeInactive?: boolean,
    ): Observable<PaginatedResponse<Product>> {
        let params = new HttpParams()
            .set("limit", limit.toString())
            .set("offset", offset.toString());

        if (category) {
            params = params.set("category", category);
        }

        if (search) {
            params = params.set("search", search);
        }

        if (includeInactive) {
            params = params.set("includeInactive", "true");
        }

        return this.http
            .get<PaginatedResponse<Product>>(this.apiUrl, {
                params,
            })
            .pipe(
                map((response) => ({
                    ...response,
                    data: (response.data || []).map((p) =>
                        this.normalizeProduct(p),
                    ),
                })),
            );
    }

    /**
     * Get single product by ID
     */
    getProductById(id: string): Observable<ApiResponse<Product>> {
        return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => ({
                ...response,
                data: response.data
                    ? this.normalizeProduct(response.data)
                    : response.data,
            })),
        );
    }

    /**
     * Set selected product
     */
    selectProduct(product: Product): void {
        this.selectedProductSubject.next(product);
    }

    /**
     * Get selected product
     */
    getSelectedProduct(): Observable<Product | null> {
        return this.selectedProduct$;
    }

    /**
     * Get products by category
     */
    getProductsByCategory(
        category: string,
    ): Observable<PaginatedResponse<Product>> {
        return this.getProducts(20, 0, category);
    }

    /**
     * Search products
     */
    searchProducts(
        query: string,
        limit: number = 20,
    ): Observable<PaginatedResponse<Product>> {
        return this.getProducts(limit, 0, undefined, query);
    }

    /**
     * Get all categories
     */
    getCategories(): Observable<ApiResponse<Category[]>>;
    getCategories(
        includeInactive?: boolean,
    ): Observable<ApiResponse<Category[]>>;
    /**
     * Get all categories. For admin usage you can pass includeInactive=true.
     */
    getCategories(
        includeInactive: boolean = false,
    ): Observable<ApiResponse<Category[]>> {
        let params = new HttpParams();
        if (includeInactive) {
            params = params.set("includeInactive", "true");
        }

        return this.http
            .get<ApiResponse<Category[]>>("/api/categories", { params })
            .pipe(
                map((response) => ({
                    ...response,
                    data: response.data
                        ? response.data.map((c) => this.normalizeCategory(c))
                        : response.data,
                })),
            );
    }

    /**
     * Create category (admin only)
     */
    createCategory(
        category: Partial<Category>,
    ): Observable<ApiResponse<Category>> {
        return this.http
            .post<ApiResponse<Category>>("/api/categories", category)
            .pipe(
                map((response) => ({
                    ...response,
                    data: response.data
                        ? this.normalizeCategory(response.data)
                        : response.data,
                })),
            );
    }

    /**
     * Update category (admin only)
     */
    updateCategory(
        id: string,
        category: Partial<Category>,
    ): Observable<ApiResponse<Category>> {
        return this.http
            .put<ApiResponse<Category>>(`/api/categories/${id}`, category)
            .pipe(
                map((response) => ({
                    ...response,
                    data: response.data
                        ? this.normalizeCategory(response.data)
                        : response.data,
                })),
            );
    }

    /**
     * Delete category (admin only)
     */
    deleteCategory(id: string): Observable<ApiResponse<null>> {
        return this.http.delete<ApiResponse<null>>(`/api/categories/${id}`);
    }

    /**
     * Create product (admin only)
     */
    createProduct(product: Product): Observable<ApiResponse<Product>> {
        return this.http.post<ApiResponse<Product>>(this.apiUrl, product);
    }

    /**
     * Update product (admin only)
     */
    updateProduct(
        id: string,
        product: Partial<Product>,
    ): Observable<ApiResponse<Product>> {
        return this.http.put<ApiResponse<Product>>(
            `${this.apiUrl}/${id}`,
            product,
        );
    }

    /**
     * Delete product (admin only)
     */
    deleteProduct(id: string): Observable<ApiResponse<null>> {
        return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
    }

    /**
     * Get current products from subject
     */
    getProductsSnapshot(): Product[] {
        return this.productsSubject.getValue();
    }
}
