/**
 * auth.middleware.ts
 * ------------------
 * JWT authentication middleware.
 *
 * Expects header: Authorization: Bearer <token>
 */

import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/httpError";
import { verifyAccessToken } from "../utils/jwt";

export function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    try {
        const authHeader = req.header("Authorization") ?? "";
        const [scheme, token] = authHeader.split(" ");

        if (scheme !== "Bearer" || !token) {
            throw new HttpError(401, "Missing or invalid Authorization header");
        }

        const payload = verifyAccessToken(token);
        req.auth = { userId: payload.userId };

        next();
    } catch (err) {
        next(err);
    }
}
