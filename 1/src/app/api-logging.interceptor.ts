import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";

@Injectable()
export class ApiLoggingInterceptor implements HttpInterceptor {
    // This interceptor runs for every HttpClient request in the app.
    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler,
    ): Observable<HttpEvent<unknown>> {
        const startedAt = Date.now();

        // We clone the request because Angular request objects are immutable.
        const taggedRequest = request.clone({
            setHeaders: {
                "X-Demo-App": "StoreV2-Learning",
            },
        });

        return next.handle(taggedRequest).pipe(
            tap({
                next: () => {
                    const duration = Date.now() - startedAt;
                    console.info(
                        `[HTTP] ${taggedRequest.method} ${taggedRequest.urlWithParams} (${duration}ms)`,
                    );
                },
                error: () => {
                    const duration = Date.now() - startedAt;
                    console.error(
                        `[HTTP] ${taggedRequest.method} ${taggedRequest.urlWithParams} failed after ${duration}ms`,
                    );
                },
            }),
        );
    }
}
