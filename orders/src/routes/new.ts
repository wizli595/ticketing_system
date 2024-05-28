import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {
    BadRequestError,
    NotFoundError,
    OrderStatus,
    requireAuth,
} from "@wizlitickets/common";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket-model";
import { Order } from "../models/order-model";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const router = Router();

/**
 * @description - Create a new order
 * @param - /api/orders
 * @returns - Order : OrderDocument
 * @example - POST /api/orders
 * @access - Private
 */
const validateOrder = [
    body("ticketId")
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage("TicketId is required"),
];
router.post(
    "/orders",
    requireAuth,
    validateOrder,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new NotFoundError();
        }
        const isReserved = await ticket.isReserved();

        if (isReserved) {
            throw new BadRequestError("Ticket is already reserved");
        }
        const experation = new Date();
        experation.setSeconds(
            experation.getSeconds() + EXPIRATION_WINDOW_SECONDS
        );

        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: experation,
            ticket,
        });
        await order.save();
        // Publish an event saying that an order was created
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price,
            },
        });
        res.status(201).send(order);
    }
);

export { router as newOrderRouter };
