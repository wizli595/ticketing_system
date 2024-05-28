import { requireAuth } from "@wizlitickets/common";
import { Request, Response, Router } from "express";
import { Order } from "../models/order-model";



const router = Router();

/**
 * @description - Get all orders
 * @param - /api/orders
 * @returns - Order[] : OrderDocument[]
 * @example - GET /api/orders
 * @access - Private
 */
router.get("/orders",requireAuth, async (req:Request, res:Response) => {
    const orders = await Order.find({userId: req.currentUser!.id}).populate('ticket');
    res.send(orders);

});


export { router as indexOrderRouter}