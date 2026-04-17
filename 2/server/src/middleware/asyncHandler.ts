/**
 * asyncHandler.ts
 * --------------
 * Express doesn't automatically catch errors thrown in async route handlers.
 * This helper wraps an async handler and forwards errors to next().
 */

import type { NextFunction, Request, Response } from "express";

export type AsyncHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<void>;

export function asyncHandler(handler: AsyncHandler) {
    return (req: Request, res: Response, next: NextFunction) => {
        handler(req, res, next).catch(next);
    };
}
