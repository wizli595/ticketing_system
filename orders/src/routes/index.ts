import { requireAuth } from "@wizlitickets/common";
import { Request, Response, Router } from "express";
import { Order } from "../models/order-model";

const router = Router();

router.get("/orders", requireAuth, async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const filter = { userId: req.currentUser!.id };

    const [orders, total] = await Promise.all([
        Order.find(filter).populate('ticket').sort({ _id: -1 }).skip(skip).limit(limit),
        Order.countDocuments(filter),
    ]);

    res.send({
        orders,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    });
});

export { router as indexOrderRouter };
