/**
 * auth.service.ts
 * --------------
 * Auth state manager + API calls.
 *
 * Responsibilities:
 * - Call backend endpoints (/auth/login, /auth/register, /auth/me)
 * - Store the JWT token in localStorage
 * - Expose current user as an observable (user$)
 */

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import type { AuthResponse, AuthUser, MeResponse } from "../models/auth.models";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private readonly tokenKey = "la2_token";

    private readonly userSubject = new BehaviorSubject<AuthUser | null>(null);

    /**
     * Stream of the current user.
     * - null means "not logged in".
     */
    public readonly user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient) {}

    public get token(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    public hasToken(): boolean {
        return !!this.token;
    }

    public get currentUser(): AuthUser | null {
        return this.userSubject.value;
    }

    /**
     * Called once on app startup.
     * - If a token is stored, validate it by calling /auth/me.
     * - If the token is invalid/expired, clear it.
     */
    public initFromStorage(): Observable<AuthUser | null> {
        if (!this.hasToken()) {
            return of(null);
        }

        return this.http
            .get<MeResponse>(`${environment.apiBaseUrl}/auth/me`)
            .pipe(
                map((res) => {
                    this.userSubject.next(res.user);
                    return res.user;
                }),
                catchError(() => {
                    this.clearSession();
                    return of(null);
                }),
            );
    }

    public login(email: string, password: string): Observable<AuthUser> {
        return this.http
            .post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, {
                email,
                password,
            })
            .pipe(
                map((res) => {
                    this.setSession(res.token, res.user);
                    return res.user;
                }),
                catchError((err) => this.handleHttpError(err, "Login failed")),
            );
    }

    public register(
        name: string,
        email: string,
        password: string,
    ): Observable<AuthUser> {
        return this.http
            .post<AuthResponse>(`${environment.apiBaseUrl}/auth/register`, {
                name,
                email,
                password,
            })
            .pipe(
                map((res) => {
                    this.setSession(res.token, res.user);
                    return res.user;
                }),
                catchError((err) =>
                    this.handleHttpError(err, "Registration failed"),
                ),
            );
    }

    public logout(): void {
        this.clearSession();
    }

    private setSession(token: string, user: AuthUser): void {
        localStorage.setItem(this.tokenKey, token);
        this.userSubject.next(user);
    }

    private clearSession(): void {
        localStorage.removeItem(this.tokenKey);
        this.userSubject.next(null);
    }

    private handleHttpError(err: unknown, fallback: string): Observable<never> {
        if (!(err instanceof HttpErrorResponse)) {
            return throwError(() => new Error(fallback));
        }

        // API shape: { error: { message: string } }
        const apiMessage = err.error?.error?.message;
        const message =
            typeof apiMessage === "string" && apiMessage.trim().length > 0
                ? apiMessage
                : fallback;

        return throwError(() => new Error(message));
    }
}
