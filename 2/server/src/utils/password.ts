/**
 * password.ts
 * -----------
 * Password hashing helpers.
 *
 * We use bcrypt:
 * - It's a slow hash (good against brute force)
 * - Never store plain text passwords
 */

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
    password: string,
    passwordHash: string,
): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
}
