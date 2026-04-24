import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@wizlitickets/common";
import { Category } from "../models/category";

const router = express.Router();

router.post(
    "/api/categories",
    requireAuth,
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("slug")
            .trim()
            .notEmpty()
            .withMessage("Slug is required")
            .matches(/^[a-z0-9-]+$/)
            .withMessage("Slug must be lowercase alphanumeric with hyphens"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { name, slug, icon } = req.body;

        const existing = await Category.findOne({ $or: [{ name }, { slug }] });
        if (existing) {
            return res.status(400).send([{ message: "Category with that name or slug already exists" }]);
        }

        const category = Category.build({ name, slug, icon: icon || "" });
        await category.save();

        res.status(201).send(category);
    }
);

export { router as createCategoryRouter };
