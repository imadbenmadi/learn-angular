/**
 * app.ts
 * ------
 * Express app configuration (middleware + routes + error handling).
 */

import cors from "cors";
import express from "express";
import morgan from "morgan";

import { env } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import { authRouter } from "./routes/auth.routes";
import { tasksRouter } from "./routes/tasks.routes";
import { HttpError } from "./utils/httpError";

export function createApp(): express.Express {
    const app = express();

    // Logs method/path + response time.
    app.use(morgan("dev"));

    // Allow the Angular dev server to call this API.
    app.use(
        cors({
            origin: env.CORS_ORIGIN,
        }),
    );

    // Parse JSON bodies (req.body).
    app.use(express.json());

    // Simple health endpoint.
    app.get("/api/health", (req, res) => {
        res.json({ ok: true });
    });

    // Routes
    app.use("/api/auth", authRouter);
    app.use("/api/tasks", tasksRouter);

    // 404 handler (no route matched)
    app.use((req, res, next) => {
        next(new HttpError(404, "Route not found"));
    });

    // Central error handler
    app.use(errorMiddleware);

    return app;
}
