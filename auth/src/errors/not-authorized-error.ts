import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
    statusCode: number = 401;
    constructor() {
        super("You are not Authorized")
    }
    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return [{ message: "You are not Authorized" }]
    }
}