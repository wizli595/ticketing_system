import { Router, Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@wizlitickets/common';

const router = Router()

router.delete('/tickets/:id', requireAuth, async (req: Request, res: Response) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if (!ticket) throw new NotFoundError();
    if (ticket.userId !== req.currentUser?.id) throw new NotAuthorizedError();

    await Ticket.findByIdAndDelete(id);

    res.status(204).send();

})

export { router as destroyTicketRoute }