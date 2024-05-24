import { Request, Response, Router } from "express";



const router = Router();

/**
 * @description - Get a specific order
 * @param - /api/orders/:id
 * @returns - message
 * @example - GET /api/orders/:id
 * @access - Private
 */

router.get("/orders/:id", async (req:Request, res:Response) => {
    res.send("Orders route");
});


export { router as showOrderRouter}