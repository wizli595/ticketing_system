import express, { Request, Response } from "express";
import { requireAuth } from "@wizlitickets/common";

const router = express.Router();

router.{{verb}}("/api/{{service}}/{{resource}}", requireAuth, async (req: Request, res: Response) => {
    // TODO: implement route logic
    res.send({});
});

export { router as {{routerName}} };
