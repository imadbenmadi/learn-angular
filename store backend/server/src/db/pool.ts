/**
 * pool.ts
 * -------
 * MySQL connection pool.
 *
 * We use a pool (not a single connection) so multiple requests can be handled
 * concurrently without manually opening/closing connections.
 */

import mysql from "mysql2/promise";

import { env } from "../config/env";

export const pool = mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    connectionLimit: 10,

    // IMPORTANT for beginners:
    // - With dateStrings=true, MySQL DATE/TIMESTAMP fields come back as strings.
    // - That makes API responses predictable (no timezone surprises in JSON).
    dateStrings: true,
});
