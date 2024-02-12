import { Request, Response, Router } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@wizlitickets/common";

const router = Router()

router.get('/tickets/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
        throw new NotFoundError();
    }
    res.status(200).send(ticket)
})

export { router as showTicketRouter }