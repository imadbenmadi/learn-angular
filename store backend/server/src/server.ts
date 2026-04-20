/**
 * server.ts
 * ---------
 * Express entrypoint.
 *
 * Why keep this file small?
 * - Your HTTP app configuration lives in app.ts
 * - This file is only responsible for starting the process
 * - Separation makes testing and refactoring easier
 */

import { createApp } from "./app";
import { env } from "./config/env";
import { pool } from "./db/pool";

async function main(): Promise<void> {
    // Fail fast if MySQL is unreachable or credentials are wrong.
    // This is especially useful while learning.
    await pool.query("SELECT 1");

    const app = createApp();

    app.listen(env.PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`[api] listening on http://localhost:${env.PORT}`);
    });
}

main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("[api] failed to start:", err);
    process.exit(1);
});
