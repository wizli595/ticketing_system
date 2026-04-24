import express, { Request, Response } from "express";
import { Category } from "../models/category";

const router = express.Router();

router.get("/api/categories", async (req: Request, res: Response) => {
    const categories = await Category.find({}).sort({ name: 1 });
    res.send(categories);
});

export { router as indexCategoryRouter };
