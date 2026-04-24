import express from "express";
import "express-async-errors";
import { currentUser, errorHandler, NotFoundError } from "@wizlitickets/common";
import cookieSession from "cookie-session";

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

// Register routes here
// app.use("/api/{{name}}", someRouter);

app.all("*", async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app, PORT };
