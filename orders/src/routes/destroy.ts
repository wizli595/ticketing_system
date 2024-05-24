import { Request, Response, Router } from "express";



const router = Router();

/**
 * @description - Delete a specific order
 * @param - /api/orders/:id
 * @returns - message
 * @example - DELETE /api/orders/:id
 * @access - Private
 */

router.delete("/orders/:id", async (req:Request, res:Response) => {
    res.send("Orders route");
});


export { router as deleteOrderRouter}