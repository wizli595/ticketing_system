export abstract class CustomError extends Error {

    abstract statusCode: number;

    constructor(message: string) {
        super();
        Object.setPrototypeOf(this, this.constructor.prototype);
    }

    abstract serializeErrors(): { message: string; field?: string }[]
}