/**
 * auth.models.ts
 * --------------
 * Shared types for the auth endpoints.
 */

export interface AuthUser {
    id: number;
    name: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: AuthUser;
}

export interface MeResponse {
    user: AuthUser & {
        createdAt?: string;
    };
}
