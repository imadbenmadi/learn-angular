/**
 * httpError.ts
 * -----------
 * A tiny Error type used to control HTTP status codes.
 *
 * In route handlers you can: throw new HttpError(400, 'Bad request')
 * and the error middleware will respond consistently.
 */

export class HttpError extends Error {
    public readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}
