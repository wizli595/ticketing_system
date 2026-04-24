import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest, NotFoundError } from "@wizlitickets/common";
import { Category } from "../models/category";

const router = express.Router();

router.put(
    "/api/categories/:id",
    requireAuth,
    [
        body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
        body("slug")
            .optional()
            .trim()
            .matches(/^[a-z0-9-]+$/)
            .withMessage("Slug must be lowercase alphanumeric with hyphens"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const category = await Category.findById(req.params.id);

        if (!category) {
            throw new NotFoundError();
        }

        const { name, slug, icon } = req.body;
        if (name !== undefined) category.set("name", name);
        if (slug !== undefined) category.set("slug", slug);
        if (icon !== undefined) category.set("icon", icon);

        await category.save();
        res.send(category);
    }
);

export { router as updateCategoryRouter };
