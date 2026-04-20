import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Order, OrderStatus } from "../../../../models";
import { OrderService } from "../../../../services/order.service";

@Component({
    selector: "app-admin-orders",
    templateUrl: "./admin-orders.component.html",
    styleUrls: ["./admin-orders.component.css"],
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
    orders: Order[] = [];
    isLoading = false;
    errorMessage: string | null = null;

    // Pagination
    currentPage = 1;
    itemsPerPage = 20;
    totalItems = 0;

    statusFilter: string = "";
    statuses = Object.values(OrderStatus);

    private destroy$ = new Subject<void>();

    constructor(private orderService: OrderService) {}

    ngOnInit(): void {
        this.load();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    load(): void {
        this.isLoading = true;
        this.errorMessage = null;
        const offset = (this.currentPage - 1) * this.itemsPerPage;

        this.orderService
            .getAllOrders(
                this.itemsPerPage,
                offset,
                this.statusFilter || undefined,
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    this.orders = resp.data || [];
                    this.totalItems = resp.pagination.total;
                    this.isLoading = false;
                },
                error: (err) => {
                    this.errorMessage =
                        err?.error?.message || "Failed to load orders.";
                    this.isLoading = false;
                },
            });
    }

    applyStatusFilter(status: string): void {
        this.statusFilter = status;
        this.currentPage = 1;
        this.load();
    }

    nextPage(): void {
        const maxPages = Math.ceil(this.totalItems / this.itemsPerPage);
        if (this.currentPage < maxPages) {
            this.currentPage++;
            this.load();
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.load();
        }
    }

    getTotalPages(): number {
        return Math.max(1, Math.ceil(this.totalItems / this.itemsPerPage));
    }

    updateStatus(order: Order, status: string): void {
        const id = order._id;
        if (!id) return;

        this.orderService
            .updateOrderStatus(id, status)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    order.status = status as any;
                },
                error: (err) => {
                    this.errorMessage =
                        err?.error?.message || "Failed to update status.";
                },
            });
    }

    getUserEmail(order: Order): string {
        const anyUser: any = (order as any).userId;
        if (!anyUser) return "-";
        if (typeof anyUser === "string") return anyUser;
        return anyUser.email || "-";
    }
}
