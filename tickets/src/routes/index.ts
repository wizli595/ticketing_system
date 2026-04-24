import { Router, Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = Router();

router.get('/tickets', async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const [tickets, total] = await Promise.all([
        Ticket.find({}).sort({ _id: -1 }).skip(skip).limit(limit),
        Ticket.countDocuments({}),
    ]);

    res.send({
        tickets,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    });
});

export { router as indexTicketRouter };
