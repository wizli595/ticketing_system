import { Request, Response, Router } from "express";



const router = Router();

/**
 * @description - Get all orders
 * @param - /api/orders
 * @returns - message
 * @example - GET /api/orders
 * @access - Private
 */
router.get("/orders", async (req:Request, res:Response) => {
    res.send("Orders route");
});


export { router as indexOrderRouter}