import { NotFoundError } from "@wizlitickets/common";
import { Request, Response, Router } from "express";
import { Order } from "../models/order-model";



const router = Router();

/**
 * @description - Get a specific order
 * @param - /api/orders/:id
 * @example - GET /api/orders/:id
 * @access - Private
 * @returns - Order : OrderDocument
 */

router.get("/orders/:id", async (req:Request, res:Response) => {
    const { id:orderId} = req.params;
    const order = await Order.findById(orderId).populate('ticket');
    if(!order || order.userId !== req.currentUser!.id){
        throw new NotFoundError();
    }
    res.send(order);
});


export { router as showOrderRouter}