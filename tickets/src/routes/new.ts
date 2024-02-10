import { requireAuth, validateRequest } from '@wizlitickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';

const router = Router();

const ticketsValidation = [
    body('title').not().isEmpty().withMessage('title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
]

router.post("/tickets", requireAuth, ticketsValidation, validateRequest, (req: Request, res: Response) => {
    res.sendStatus(200)
})

export { router as createTicketRouter }