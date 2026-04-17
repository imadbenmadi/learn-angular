/**
 * env.ts
 * ------
 * Central place to read and validate environment variables.
 *
 * Beginner tip:
 * - Keep your process.env access in one file.
 * - It prevents "mystery" values and makes refactors easy.
 */

import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

function numberEnv(name: string, fallback: number): number {
    const raw = process.env[name];
    if (!raw) {
        return fallback;
    }

    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
        throw new Error(
            `Environment variable ${name} must be a number (got: ${raw})`,
        );
    }

    return parsed;
}

export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: numberEnv("PORT", 3000),

    CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:4200",

    DB_HOST: requireEnv("DB_HOST"),
    DB_PORT: numberEnv("DB_PORT", 3306),
    DB_USER: requireEnv("DB_USER"),
    DB_PASSWORD: process.env.DB_PASSWORD ?? "",
    DB_NAME: requireEnv("DB_NAME"),

    JWT_SECRET: requireEnv("JWT_SECRET"),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "2h",
} as const;
