import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ColDef, GridReadyEvent } from "ag-grid-community";
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

    columnDefs: ColDef[] = [];
    defaultColDef: ColDef = {
        resizable: true,
        sortable: true,
    };
    context: any;

    private gridApi: any;

    // Pagination
    currentPage = 1;
    itemsPerPage = 20;
    totalItems = 0;

    statusFilter: string = "";
    statuses = Object.values(OrderStatus);

    private destroy$ = new Subject<void>();

    constructor(private orderService: OrderService) {}

    ngOnInit(): void {
        this.context = { componentParent: this };
        this.columnDefs = [
            {
                headerName: "Order",
                flex: 1,
                minWidth: 160,
                valueGetter: (p: any) => p.data?.orderId || p.data?._id,
            },
            {
                headerName: "Customer",
                flex: 1,
                minWidth: 180,
                valueGetter: (p: any) => this.getUserEmail(p.data),
            },
            { headerName: "Status", field: "status", width: 140 },
            {
                headerName: "Total",
                field: "totalAmount",
                width: 140,
                valueFormatter: (p: any) => `₹${p.value}`,
            },
            {
                headerName: "Date",
                field: "createdAt",
                width: 160,
                valueFormatter: (p: any) => {
                    const v = p.value;
                    const d = v ? new Date(v) : null;
                    return d && !Number.isNaN(d.getTime())
                        ? d.toLocaleDateString()
                        : "-";
                },
            },
            {
                headerName: "Update",
                width: 220,
                cellRenderer: this.updateCellRenderer.bind(this),
                sortable: false,
            },
        ];

        this.load();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onGridReady(event: GridReadyEvent): void {
        this.gridApi = event.api;
        event.api.sizeColumnsToFit();
    }

    private updateCellRenderer(params: any): HTMLElement {
        const select = document.createElement("select");
        select.className = "";

        const statuses: string[] =
            params?.context?.componentParent?.statuses || [];

        for (const s of statuses) {
            const opt = document.createElement("option");
            opt.value = s;
            opt.textContent = s;
            if (params?.data?.status === s) {
                opt.selected = true;
            }
            select.appendChild(opt);
        }

        select.addEventListener("change", (e) => {
            const value = (e.target as HTMLSelectElement).value;
            params?.context?.componentParent?.updateStatus(params.data, value);
        });

        return select;
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
                    this.gridApi?.refreshCells({ force: true });
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
