import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap, map } from "rxjs/operators";
import {
    User,
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    UserRole,
} from "../models";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private apiUrl = "/api/auth";
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    private readonly TOKEN_KEY = "auth_token";
    private readonly USER_KEY = "current_user";

    constructor(private http: HttpClient) {
        this.loadStoredUser();
    }

    /**
     * Load stored user and token from localStorage
     */
    private loadStoredUser(): void {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const user = localStorage.getItem(this.USER_KEY);

        if (token && user) {
            try {
                const userData = JSON.parse(user);
                this.currentUserSubject.next(userData);
                this.isAuthenticatedSubject.next(true);
            } catch (e) {
                console.error("Error loading stored user:", e);
                this.logout();
            }
        }
    }

    /**
     * Register new user
     */
    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.apiUrl}/register`, request)
            .pipe(tap((response) => this.handleAuthResponse(response)));
    }

    /**
     * Login user
     */
    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.apiUrl}/login`, request)
            .pipe(tap((response) => this.handleAuthResponse(response)));
    }

    /**
     * Logout user
     */
    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
    }

    /**
     * Get current user
     */
    getCurrentUser(): Observable<User | null> {
        return this.currentUser$;
    }

    /**
     * Get current user snapshot
     */
    getCurrentUserSnapshot(): User | null {
        return this.currentUserSubject.getValue();
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.getValue();
    }

    /**
     * Get authentication token
     */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Check if user has admin role
     */
    isAdmin(): boolean {
        const user = this.currentUserSubject.getValue();
        return user?.role === UserRole.ADMIN;
    }

    /**
     * Check if user has manager role
     */
    isManager(): boolean {
        const user = this.currentUserSubject.getValue();
        return user?.role === UserRole.MANAGER;
    }

    /**
     * Verify token (refresh if needed)
     */
    verifyToken(): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.apiUrl}/verify`, {})
            .pipe(tap((response) => this.handleAuthResponse(response)));
    }

    /**
     * Update user profile
     */
    updateProfile(user: Partial<User>): Observable<AuthResponse> {
        return this.http
            .put<AuthResponse>(`${this.apiUrl}/profile`, user)
            .pipe(tap((response) => this.handleAuthResponse(response)));
    }

    /**
     * Handle authentication response
     */
    private handleAuthResponse(response: AuthResponse): void {
        const token = response?.data?.token;
        const user = response?.data?.user;

        if (token && user) {
            localStorage.setItem(this.TOKEN_KEY, token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
        }
    }
}
