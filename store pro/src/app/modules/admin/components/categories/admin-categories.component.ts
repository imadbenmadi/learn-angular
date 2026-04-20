import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Category } from "../../../../models";
import { ProductService } from "../../../../services/product.service";

@Component({
    selector: "app-admin-categories",
    templateUrl: "./admin-categories.component.html",
    styleUrls: ["./admin-categories.component.css"],
})
export class AdminCategoriesComponent implements OnInit, OnDestroy {
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
            slug: ["", [Validators.required]],
            description: [""],
            image: [""],
            isActive: [true],
        });
    }

    ngOnInit(): void {
        this.load();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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
            `Delete category "${category.name}"? Products may reference it.`,
        );
        if (!ok) return;

        this.productService
            .deleteCategory(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.successMessage = "Category deleted.";
                    this.load();
                },
                error: (err) => {
                    this.errorMessage =
                        err?.error?.message || "Failed to delete category.";
                },
            });
    }
}
