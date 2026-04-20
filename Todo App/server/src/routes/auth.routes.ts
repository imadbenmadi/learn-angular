/**
 * auth.routes.ts
 * --------------
 * Authentication endpoints:
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - GET  /api/auth/me
 */

import { Router } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { pool } from "../db/pool";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth.middleware";
import { HttpError } from "../utils/httpError";
import { signAccessToken } from "../utils/jwt";
import { hashPassword, verifyPassword } from "../utils/password";

export const authRouter = Router();

function asTrimmedString(value: unknown): string {
    return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
    // Simple email validation (good enough for a learning project)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

authRouter.post(
    "/register",
    asyncHandler(async (req, res) => {
        const name = asTrimmedString(req.body?.name);
        const email = asTrimmedString(req.body?.email).toLowerCase();
        const password = asTrimmedString(req.body?.password);

        // Basic validation
        if (name.length < 2) {
            throw new HttpError(400, "Name must be at least 2 characters");
        }
        if (!isValidEmail(email)) {
            throw new HttpError(400, "Email is invalid");
        }
        if (password.length < 8) {
            throw new HttpError(400, "Password must be at least 8 characters");
        }

        // Check if email is already used
        const [existing] = await pool.execute<RowDataPacket[]>(
            "SELECT id FROM users WHERE email = ?",
            [email],
        );
        if (existing.length > 0) {
            throw new HttpError(409, "Email is already in use");
        }

        const passwordHash = await hashPassword(password);

        const [result] = await pool.execute<ResultSetHeader>(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            [name, email, passwordHash],
        );
        if (result.affectedRows !== 1) {
            throw new HttpError(500, "Failed to create user");
        }
        const userId = result.insertId;
        const token = signAccessToken({ userId });

        res.status(201).json({
            token,
            user: {
                id: userId,
                name,
                email,
            },
        });
    }),
);

authRouter.post(
    "/login",
    asyncHandler(async (req, res) => {
        const email = asTrimmedString(req.body?.email).toLowerCase();
        const password = asTrimmedString(req.body?.password);

        if (!isValidEmail(email)) {
            throw new HttpError(400, "Email is invalid");
        }
        if (!password) {
            throw new HttpError(400, "Password is required");
        }

        type DbUser = RowDataPacket & {
            id: number;
            name: string;
            email: string;
            password_hash: string;
        };

        const [rows] = await pool.execute<DbUser[]>(
            "SELECT id, name, email, password_hash FROM users WHERE email = ?",
            [email],
        );

        if (rows.length === 0) {
            // Don't reveal whether email exists.
            throw new HttpError(401, "Invalid email or password");
        }

        const user = rows[0];
        const ok = await verifyPassword(password, user.password_hash);
        if (!ok) {
            throw new HttpError(401, "Invalid email or password");
        }

        const token = signAccessToken({ userId: user.id });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }),
);

authRouter.get(
    "/me",
    requireAuth,
    asyncHandler(async (req, res) => {
        const userId = req.auth!.userId;

        type MeRow = RowDataPacket & {
            id: number;
            name: string;
            email: string;
            created_at: string;
        };

        const [rows] = await pool.execute<MeRow[]>(
            "SELECT id, name, email, created_at FROM users WHERE id = ?",
            [userId],
        );

        if (rows.length === 0) {
            throw new HttpError(404, "User not found");
        }

        const user = rows[0];

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.created_at,
            },
        });
    }),
);
