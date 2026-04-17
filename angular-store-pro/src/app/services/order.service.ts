import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Order, ApiResponse, PaginatedResponse } from "../models";

@Injectable({
    providedIn: "root",
})
export class OrderService {
    private apiUrl = "/api/orders";

    constructor(private http: HttpClient) {}

    /**
     * Create new order
     */
    createOrder(order: Order): Observable<ApiResponse<Order>> {
        return this.http.post<ApiResponse<Order>>(this.apiUrl, order);
    }

    /**
     * Get all orders (admin)
     */
    getAllOrders(
        limit: number = 20,
        offset: number = 0,
        status?: string,
    ): Observable<PaginatedResponse<Order>> {
        let params = new HttpParams()
            .set("limit", limit.toString())
            .set("offset", offset.toString());

        if (status) {
            params = params.set("status", status);
        }

        return this.http.get<PaginatedResponse<Order>>(this.apiUrl, { params });
    }

    /**
     * Get user's orders
     */
    getUserOrders(
        userId: string,
        limit: number = 20,
        offset: number = 0,
    ): Observable<PaginatedResponse<Order>> {
        const params = new HttpParams()
            .set("userId", userId)
            .set("limit", limit.toString())
            .set("offset", offset.toString());

        return this.http.get<PaginatedResponse<Order>>(`${this.apiUrl}/user`, {
            params,
        });
    }

    /**
     * Get single order by ID
     */
    getOrderById(id: string): Observable<ApiResponse<Order>> {
        return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${id}`);
    }

    /**
     * Update order status (admin)
     */
    updateOrderStatus(
        id: string,
        status: string,
    ): Observable<ApiResponse<Order>> {
        return this.http.patch<ApiResponse<Order>>(
            `${this.apiUrl}/${id}/status`,
            { status },
        );
    }

    /**
     * Cancel order
     */
    cancelOrder(id: string): Observable<ApiResponse<Order>> {
        return this.http.patch<ApiResponse<Order>>(
            `${this.apiUrl}/${id}/cancel`,
            {},
        );
    }

    /**
     * Get order tracking
     */
    getOrderTracking(id: string): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}/tracking`);
    }
}
