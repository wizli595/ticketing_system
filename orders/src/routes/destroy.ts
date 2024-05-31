import { NotFoundError, OrderStatus, requireAuth } from "@wizlitickets/common";
import { Request, Response, Router } from "express";
import { Order } from "../models/order-model";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";

const router = Router();

/**
 * @description - Delete a specific order
 * @param - /api/orders/:id
 * @returns - Order : OrderDocument
 * @example - DELETE /api/orders/:id
 * @access - Private
 */

router.delete(
    "/orders/:id",
    requireAuth,
    async (req: Request, res: Response) => {
        const { id: orderId } = req.params;
        const order = await Order.findById(orderId);
        if (!order || order.userId !== req.currentUser!.id) {
            throw new NotFoundError();
        }
        // we just want to update the status of the order to cancelled
        // not actually delete the order
        order.status = OrderStatus.Cancelled;
        await order.save();
        // publish an event saying that an order was cancelled
        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
            },
        });

        res.status(204).send(order);
    }
);

export { router as deleteOrderRouter };
