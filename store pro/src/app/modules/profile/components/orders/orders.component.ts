import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Order } from "../../../../models";
import { OrderService } from "../../../../services/order.service";

@Component({
    selector: "app-profile-orders",
    templateUrl: "./orders.component.html",
    styleUrls: ["./orders.component.css"],
})
export class OrdersComponent implements OnInit, OnDestroy {
    orders: Order[] = [];
    isLoading = false;
    errorMessage: string | null = null;

    private destroy$ = new Subject<void>();

    constructor(private orderService: OrderService) {}

    ngOnInit(): void {
        this.load();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private load(): void {
        this.isLoading = true;
        this.errorMessage = null;

        // Backend reads user id from JWT; userId param is ignored there.
        this.orderService
            .getUserOrders("me")
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    this.orders = resp.data || [];
                    this.isLoading = false;
                },
                error: (err) => {
                    this.errorMessage =
                        err?.error?.message || "Failed to load orders.";
                    this.isLoading = false;
                },
            });
    }
}
