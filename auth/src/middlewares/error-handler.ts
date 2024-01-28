import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler: ErrorRequestHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }



    res.status(400).send({
        errors: [{ message: err.message }]
    })
}
