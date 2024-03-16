import { requireAuth, validateRequest } from '@wizlitickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../../utils/nats-wrapper';

const router = Router();

const ticketsValidation = [
    body('title').not().isEmpty().withMessage('title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
]

router.post("/tickets", requireAuth, ticketsValidation,
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;
        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id
        })
        await ticket.save()

        await new TicketCreatedPublisher(natsWrapper.client)
            .publish(ticket.toJSON())

        res.status(201).send(ticket);
    })




export { router as createTicketRouter }