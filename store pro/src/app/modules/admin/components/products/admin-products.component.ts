import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Category, Product } from "../../../../models";
import { ProductService } from "../../../../services/product.service";

@Component({
    selector: "app-admin-products",
    templateUrl: "./admin-products.component.html",
    styleUrls: ["./admin-products.component.css"],
})
export class AdminProductsComponent implements OnInit, OnDestroy {
    products: Product[] = [];
    categories: Category[] = [];

    form: FormGroup;
    editingId: string | null = null;

    isLoading = false;
    isSaving = false;
    errorMessage: string | null = null;
    successMessage: string | null = null;

    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
    ) {
        this.form = this.fb.group({
            name: ["", [Validators.required]],
            sku: ["", [Validators.required]],
            price: [0, [Validators.required, Validators.min(0)]],
            salePrice: [null],
            stock: [0, [Validators.required, Validators.min(0)]],
            category: ["", [Validators.required]],
            image: ["", [Validators.required]],
            description: ["", [Validators.required]],
            isActive: [true],
        });
    }

    ngOnInit(): void {
        this.loadCategories();
        this.loadProducts();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadCategories(): void {
        this.productService
            .getCategories(true)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    this.categories = resp.data || [];
                },
                error: () => {
                    // Non-blocking for products form; products can still load
                },
            });
    }

    private loadProducts(): void {
        this.isLoading = true;
        this.errorMessage = null;

        this.productService
            .getProducts(200, 0, undefined, undefined, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    this.products = resp.data || [];
                    this.isLoading = false;
                },
                error: (err) => {
                    this.errorMessage =
                        err?.error?.message || "Failed to load products.";
                    this.isLoading = false;
                },
            });
    }

    startCreate(): void {
        this.editingId = null;
        this.successMessage = null;
        this.errorMessage = null;
        this.form.reset({
            name: "",
            sku: "",
            price: 0,
            salePrice: null,
            stock: 0,
            category: "",
            image: "",
            description: "",
            isActive: true,
        });
    }

    startEdit(product: Product): void {
        this.editingId = product.id || product._id || null;
        this.successMessage = null;
        this.errorMessage = null;

        const categoryAny: any = product.category as any;
        const categoryId =
            typeof categoryAny === "string"
                ? categoryAny
                : categoryAny?.id || categoryAny?._id || "";

        this.form.reset({
            name: product.name,
            sku: product.sku,
            price: product.price,
            salePrice: product.salePrice ?? null,
            stock: product.stock,
            category: categoryId,
            image: product.image,
            description: product.description,
            isActive: product.isActive !== false,
        });
    }

    submit(): void {
        this.successMessage = null;
        this.errorMessage = null;

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.isSaving = true;

        const raw = this.form.value;
        const price = Number(raw.price);
        const stock = Number(raw.stock);
        const salePriceNum =
            raw.salePrice === "" ? null : Number(raw.salePrice);
        const salePrice =
            salePriceNum != null && Number.isFinite(salePriceNum)
                ? salePriceNum
                : null;

        const payload: any = {
            ...raw,
            price: Number.isFinite(price) ? price : 0,
            stock: Number.isFinite(stock) ? stock : 0,
            salePrice,
        };

        const request$ = this.editingId
            ? this.productService.updateProduct(this.editingId, payload)
            : this.productService.createProduct(payload);

        request$.pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.isSaving = false;
                this.successMessage = this.editingId
                    ? "Product updated."
                    : "Product created.";
                this.loadProducts();
                this.startCreate();
            },
            error: (err) => {
                this.errorMessage =
                    err?.error?.message || "Failed to save product.";
                this.isSaving = false;
            },
        });
    }

    toggleActive(product: Product): void {
        const id = product.id || product._id;
        if (!id) return;

        const currentActive = product.isActive !== false;
        const nextActive = !currentActive;
        this.productService
            .updateProduct(id, { isActive: nextActive } as any)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    product.isActive = nextActive;
                },
            });
    }

    delete(product: Product): void {
        const id = product.id || product._id;
        if (!id) return;

        const ok = window.confirm(
            `Delete product "${product.name}"? This cannot be undone.`,
        );
        if (!ok) return;

        this.productService
            .deleteProduct(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.successMessage = "Product deleted.";
                    this.loadProducts();
                },
                error: (err) => {
                    this.errorMessage =
                        err?.error?.message || "Failed to delete product.";
                },
            });
    }

    getCategoryName(product: Product): string {
        const categoryAny: any = product.category as any;
        if (!categoryAny) return "-";
        if (typeof categoryAny === "string") {
            const found = this.categories.find(
                (c) => c.id === categoryAny || c._id === categoryAny,
            );
            return found?.name || categoryAny;
        }
        return categoryAny?.name || "-";
    }
}
