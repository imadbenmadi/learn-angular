import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ColDef, GridReadyEvent } from "ag-grid-community";
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

    columnDefs: ColDef[] = [];
    defaultColDef: ColDef = {
        resizable: true,
        sortable: true,
    };
    context: any;

    private gridApi: any;

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

        this.context = { componentParent: this };
        this.columnDefs = [
            {
                headerName: "Product",
                field: "name",
                flex: 1,
                minWidth: 260,
                cellRenderer: this.productCellRenderer.bind(this),
                sortable: false,
            },
            {
                headerName: "Category",
                flex: 1,
                minWidth: 160,
                valueGetter: (p: any) => this.getCategoryName(p.data),
            },
            { headerName: "Stock", field: "stock", width: 110 },
            {
                headerName: "Price",
                width: 140,
                valueGetter: (p: any) => {
                    const data = p.data as Product;
                    const display =
                        data.salePrice && data.salePrice < data.price
                            ? data.salePrice
                            : data.price;
                    return display;
                },
                valueFormatter: (p: any) => `₹${p.value}`,
            },
            {
                headerName: "Status",
                field: "isActive",
                width: 140,
                cellRenderer: this.statusCellRenderer.bind(this),
                sortable: false,
            },
            {
                headerName: "Actions",
                width: 290,
                cellRenderer: this.actionsCellRenderer.bind(this),
                sortable: false,
            },
        ];
    }

    ngOnInit(): void {
        this.loadCategories();
        this.loadProducts();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onGridReady(event: GridReadyEvent): void {
        this.gridApi = event.api;
        event.api.sizeColumnsToFit();
    }

    private productCellRenderer(params: any): HTMLElement {
        const data = params.data as Product;

        const wrap = document.createElement("div");
        wrap.className = "product-cell";

        const img = document.createElement("img");
        img.className = "thumb";
        img.alt = data?.name || "";
        img.src =
            data?.image || "/api/images/placeholder?w=44&h=44&text=No%20Image";
        img.addEventListener("error", () => {
            img.src = "/api/images/placeholder?w=44&h=44&text=No%20Image";
        });

        const textWrap = document.createElement("div");
        const name = document.createElement("div");
        name.className = "name";
        name.textContent = data?.name || "";

        const sku = document.createElement("small");
        sku.className = "text-muted";
        sku.textContent = data?.sku || "";

        textWrap.appendChild(name);
        textWrap.appendChild(sku);

        wrap.appendChild(img);
        wrap.appendChild(textWrap);
        return wrap;
    }

    private statusCellRenderer(params: any): HTMLElement {
        const span = document.createElement("span");
        span.className = "badge";
        if (params?.value === false) {
            span.classList.add("badge-muted");
        }
        span.textContent = params?.value === false ? "Inactive" : "Active";
        return span;
    }

    private actionsCellRenderer(params: any): HTMLElement {
        const wrap = document.createElement("div");
        wrap.className = "row-actions";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn btn-secondary btn-sm";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => {
            params?.context?.componentParent?.startEdit(params.data);
        });

        const toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.className = "btn btn-secondary btn-sm";
        const isInactive = params?.data?.isActive === false;
        toggleBtn.textContent = isInactive ? "Activate" : "Deactivate";
        toggleBtn.addEventListener("click", () => {
            params?.context?.componentParent?.toggleActive(params.data);
        });

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "btn btn-danger btn-sm";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => {
            params?.context?.componentParent?.delete(params.data);
        });

        wrap.appendChild(editBtn);
        wrap.appendChild(toggleBtn);
        wrap.appendChild(delBtn);
        return wrap;
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
                    this.gridApi?.refreshCells({ force: true });
                },
            });
    }

    delete(product: Product): void {
        const id = product.id || product._id;
        if (!id) return;

        const ok = window.confirm(
            `Delete product "${product.name}"? If it exists in orders, it will be archived (disabled) instead of deleted.`,
        );
        if (!ok) return;

        this.productService
            .deleteProduct(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    this.successMessage = resp?.message || "Product updated.";
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
