import { Injectable } from "@angular/core";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler,
    ): Observable<HttpEvent<unknown>> {
        // Add auth token to requests
        const token = this.authService.getToken();
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        // Add content type if not already set
        if (!request.headers.has("Content-Type")) {
            request = request.clone({
                setHeaders: {
                    "Content-Type": "application/json",
                },
            });
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                // Handle 401 unauthorized
                if (error.status === 401) {
                    this.authService.logout();
                    // Redirect to login page if needed
                    // router.navigate(['/login']);
                }

                return throwError(() => error);
            }),
        );
    }
}
