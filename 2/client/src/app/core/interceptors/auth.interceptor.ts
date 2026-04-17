/**
 * auth.interceptor.ts
 * -------------------
 * Adds the JWT token to outgoing HTTP requests.
 *
 * This is the standard Angular pattern:
 * - Store token in a service
 * - Interceptor reads token and attaches Authorization header
 */

import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(
        req: HttpRequest<unknown>,
        next: HttpHandler,
    ): Observable<HttpEvent<unknown>> {
        const token = this.authService.token;

        // Only clone the request if we actually have a token.
        const authReq = token
            ? req.clone({
                  setHeaders: {
                      Authorization: `Bearer ${token}`,
                  },
              })
            : req;

        return next.handle(authReq).pipe(
            catchError((err: unknown) => {
                // If the API says "unauthorized", the token is probably expired/invalid.
                if (err instanceof HttpErrorResponse && err.status === 401) {
                    this.authService.logout();
                }

                return throwError(() => err);
            }),
        );
    }
}
