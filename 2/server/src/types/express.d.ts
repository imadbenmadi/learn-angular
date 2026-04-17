import "express";

declare global {
    namespace Express {
        interface Request {
            /**
             * Set by requireAuth() after validating the JWT.
             *
             * Why store only userId?
             * - It's enough for authorization checks
             * - You can always load more user data from the DB when needed
             */
            auth?: {
                userId: number;
            };
        }
    }
}

export {};
