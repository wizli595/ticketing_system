import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    reason = 'Error connectiong to db';
    constructor() {
        super('db not connected');

    }
    serializeErrors() {
        return [{ message: this.reason }]
    }
}