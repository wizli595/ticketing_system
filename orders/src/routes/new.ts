import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {requireAuth} from '@wizlitickets/common'
import mongoose from "mongoose";


const router = Router();

/**
 * @description - Create a new order
 * @param - /api/orders
 * @returns - message
 * @example - POST /api/orders
 * @access - Private
 */ 
const validateOrder = [
    body("ticketId")
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage("TicketId is required")
];
router.post("/orders",requireAuth,validateOrder, async (req:Request, res:Response) => {
    res.send("Orders route");
});


export { router as newOrderRouter}