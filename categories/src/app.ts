import express from "express";
import "express-async-errors";
import { currentUser, errorHandler, NotFoundError } from "@wizlitickets/common";
import cookieSession from "cookie-session";
import { indexCategoryRouter } from "./routes/index";
import { showCategoryRouter } from "./routes/show";
import { createCategoryRouter } from "./routes/new";
import { updateCategoryRouter } from "./routes/update";
import { deleteCategoryRouter } from "./routes/destroy";
import { seedCategoryRouter } from "./routes/seed";

const app = express();
const PORT = 3000;

app.set("trust proxy", true);

app.use(express.json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== "test",
    })
);

app.use(currentUser);

app.use(indexCategoryRouter);
app.use(showCategoryRouter);
app.use(createCategoryRouter);
app.use(updateCategoryRouter);
app.use(deleteCategoryRouter);
app.use(seedCategoryRouter);

app.all("*", async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app, PORT };
