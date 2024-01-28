import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
    statusCode = 404;
    constructor() {
        super('Not Found')
    }
    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return [{ message: "Not Found!" }];
    }
}