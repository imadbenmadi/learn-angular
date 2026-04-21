import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ColDef, GridReadyEvent } from "ag-grid-community";
import { Category } from "../../../../models";
import { ProductService } from "../../../../services/product.service";

@Component({
    selector: "app-admin-categories",
    templateUrl: "./admin-categories.component.html",
    styleUrls: ["./admin-categories.component.css"],
})
export class AdminCategoriesComponent implements OnInit, OnDestroy {
    categories: Category[] = [];

    columnDefs: ColDef[] = [];
    defaultColDef: ColDef = {
        resizable: true,
        sortable: true,
    };
    context: any;

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
            slug: ["", [Validators.required]],
            description: [""],
            image: [""],
            isActive: [true],
        });

        this.context = { componentParent: this };
        this.columnDefs = [
            { headerName: "Name", field: "name", flex: 1, minWidth: 180 },
            { headerName: "Slug", field: "slug", width: 180 },
            {
                headerName: "Status",
                field: "isActive",
                width: 140,
                cellRenderer: this.statusCellRenderer.bind(this),
                sortable: false,
            },
            {
                headerName: "Actions",
                width: 190,
                cellRenderer: this.actionsCellRenderer.bind(this),
                sortable: false,
            },
        ];
    }

    ngOnInit(): void {
        this.load();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onGridReady(event: GridReadyEvent): void {
        // Fit columns when grid initializes; keep simple (no server-side row model)
        event.api.sizeColumnsToFit();
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

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "btn btn-danger btn-sm";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => {
            params?.context?.componentParent?.delete(params.data);
        });

        wrap.appendChild(editBtn);
        wrap.appendChild(delBtn);
        return wrap;
    }

    private load(): void {
        this.isLoading = true;
        this.productService
            .getCategories(true)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    this.categories = resp.data || [];
                    this.isLoading = false;
                },
                error: (err) => {
                    this.errorMessage =
                        err?.error?.message || "Failed to load categories.";
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
            slug: "",
            description: "",
            image: "",
            isActive: true,
        });
    }

    startEdit(category: Category): void {
        this.editingId = category.id || category._id || null;
        this.successMessage = null;
        this.errorMessage = null;
        this.form.reset({
            name: category.name,
            slug: category.slug,
            description: category.description || "",
            image: category.image || "",
            isActive: category.isActive,
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
        const payload = {
            ...this.form.value,
            slug: String(this.form.value.slug || "")
                .trim()
                .toLowerCase(),
        };

        const request$ = this.editingId
            ? this.productService.updateCategory(this.editingId, payload)
            : this.productService.createCategory(payload);

        request$.pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.isSaving = false;
                this.successMessage = this.editingId
                    ? "Category updated."
                    : "Category created.";
                this.load();
                this.startCreate();
            },
            error: (err) => {
                this.errorMessage =
                    err?.error?.message || "Failed to save category.";
                this.isSaving = false;
            },
        });
    }

    delete(category: Category): void {
        const id = category.id || category._id;
        if (!id) return;

        const ok = window.confirm(
            `Delete category "${category.name}"? If products reference it, it will be archived (disabled) instead of deleted.`,
        );
        if (!ok) return;

        this.productService
            .deleteCategory(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    this.successMessage = resp?.message || "Category updated.";
                    this.load();
                },
                error: (err) => {
                    this.errorMessage =
                        err?.error?.message || "Failed to delete category.";
                },
            });
    }
}
