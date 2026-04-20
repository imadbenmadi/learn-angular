/**
 * error.middleware.ts
 * -------------------
 * Centralized error handling.
 *
 * Why this matters:
 * - Your routes stay clean (throw HttpError instead of manual res.status everywhere)
 * - All errors become consistent JSON responses
 */

import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/httpError";

type AnyError = {
    name?: string;
    message?: string;
    code?: string;
};

export function errorMiddleware(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const e = err as AnyError;

    // JWT errors from jsonwebtoken typically come with these names.
    if (e?.name === "JsonWebTokenError" || e?.name === "TokenExpiredError") {
        res.status(401).json({
            error: {
                message: "Invalid or expired token",
            },
        });
        return;
    }

    // Example: MySQL duplicate key (useful for unique email constraints).
    if (e?.code === "ER_DUP_ENTRY") {
        res.status(409).json({
            error: {
                message: "Duplicate resource",
            },
        });
        return;
    }

    const status = err instanceof HttpError ? err.status : 500;
    const message =
        err instanceof HttpError ? err.message : "Internal server error";

    // Only log 500s (avoid noisy logs for normal validation errors).
    if (status >= 500) {
        // eslint-disable-next-line no-console
        console.error(err);
    }

    res.status(status).json({
        error: {
            message,
        },
    });
}
