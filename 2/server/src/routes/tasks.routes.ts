/**
 * tasks.routes.ts
 * ---------------
 * CRUD endpoints for tasks:
 * - GET    /api/tasks
 * - GET    /api/tasks/:id
 * - POST   /api/tasks
 * - PUT    /api/tasks/:id
 * - DELETE /api/tasks/:id
 *
 * Important:
 * - Every query is scoped to the authenticated user (user_id)
 */

import { Router } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { pool } from "../db/pool";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth.middleware";
import { HttpError } from "../utils/httpError";

export const tasksRouter = Router();

tasksRouter.use(requireAuth);

const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

function asTrimmedString(value: unknown): string {
    return typeof value === "string" ? value.trim() : "";
}

function parseIdParam(raw: string): number {
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) {
        throw new HttpError(400, "Invalid id parameter");
    }
    return id;
}

function parseStatus(raw: unknown): TaskStatus {
    const status = asTrimmedString(raw).toUpperCase();
    if (!TASK_STATUSES.includes(status as TaskStatus)) {
        throw new HttpError(
            400,
            `Status must be one of: ${TASK_STATUSES.join(", ")}`,
        );
    }
    return status as TaskStatus;
}

function parseDueDate(raw: unknown): string | null {
    const value = asTrimmedString(raw);
    if (!value) {
        return null;
    }

    // Expect YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new HttpError(400, "dueDate must be in YYYY-MM-DD format");
    }

    return value;
}

type TaskRow = RowDataPacket & {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
};

function mapDbTask(row: TaskRow) {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        status: row.status,
        dueDate: row.dueDate,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}

tasksRouter.get(
    "/",
    asyncHandler(async (req, res) => {
        const userId = req.auth!.userId;

        const [rows] = await pool.execute<TaskRow[]>(
            `
      SELECT
        id,
        title,
        description,
        status,
        due_date AS dueDate,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM tasks
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
            [userId],
        );

        res.json({
            tasks: rows.map(mapDbTask),
        });
    }),
);

tasksRouter.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const userId = req.auth!.userId;
        const taskId = parseIdParam(req.params.id);

        const [rows] = await pool.execute<TaskRow[]>(
            `
      SELECT
        id,
        title,
        description,
        status,
        due_date AS dueDate,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM tasks
      WHERE id = ? AND user_id = ?
      `,
            [taskId, userId],
        );

        if (rows.length === 0) {
            throw new HttpError(404, "Task not found");
        }

        res.json({
            task: mapDbTask(rows[0]),
        });
    }),
);

tasksRouter.post(
    "/",
    asyncHandler(async (req, res) => {
        const userId = req.auth!.userId;

        const title = asTrimmedString(req.body?.title);
        const description = asTrimmedString(req.body?.description) || null;
        const status = req.body?.status ? parseStatus(req.body.status) : "TODO";
        const dueDate = parseDueDate(req.body?.dueDate);

        if (title.length < 2) {
            throw new HttpError(400, "Title must be at least 2 characters");
        }
        else if (description && description.length > 1000) {
            throw new HttpError(400, "Description must be at most 1000 characters");
        }
        const [result] = await pool.execute<ResultSetHeader>(
            "INSERT INTO tasks (user_id, title, description, status, due_date) VALUES (?, ?, ?, ?, ?)",
            [userId, title, description, status, dueDate],
        );

        const taskId = result.insertId;

        const [rows] = await pool.execute<TaskRow[]>(
            `
      SELECT
        id,
        title,
        description,
        status,
        due_date AS dueDate,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM tasks
      WHERE id = ? AND user_id = ?
      `,
            [taskId, userId],
        );

        res.status(201).json({
            task: mapDbTask(rows[0]),
        });
    }),
);

tasksRouter.put(
    "/:id",
    asyncHandler(async (req, res) => {
        const userId = req.auth!.userId;
        const taskId = parseIdParam(req.params.id);

        const title = asTrimmedString(req.body?.title);
        const description = asTrimmedString(req.body?.description) || null;
        const status = parseStatus(req.body?.status);
        const dueDate = parseDueDate(req.body?.dueDate);

        if (title.length < 2) {
            throw new HttpError(400, "Title must be at least 2 characters");
        }

        const [result] = await pool.execute<ResultSetHeader>(
            "UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ? AND user_id = ?",
            [title, description, status, dueDate, taskId, userId],
        );

        if (result.affectedRows === 0) {
            throw new HttpError(404, "Task not found");
        }

        const [rows] = await pool.execute<TaskRow[]>(
            `
      SELECT
        id,
        title,
        description,
        status,
        due_date AS dueDate,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM tasks
      WHERE id = ? AND user_id = ?
      `,
            [taskId, userId],
        );

        res.json({
            task: mapDbTask(rows[0]),
        });
    }),
);

tasksRouter.delete(
    "/:id",
    asyncHandler(async (req, res) => {
        const userId = req.auth!.userId;
        const taskId = parseIdParam(req.params.id);

        const [result] = await pool.execute<ResultSetHeader>(
            "DELETE FROM tasks WHERE id = ? AND user_id = ?",
            [taskId, userId],
        );

        if (result.affectedRows === 0) {
            throw new HttpError(404, "Task not found");
        }

        res.status(204).send();
    }),
);
