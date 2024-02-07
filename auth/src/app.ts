import express from 'express';
import 'express-async-errors';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@wizlitickets/common';

import cookieSession from 'cookie-session';


const app = express()
const PORT = 3000

app.set('trust proxy', true);
app.use(express.json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))

app.use("/api/users", currentUserRouter)
app.use("/api/users", signInRouter)
app.use("/api/users", signOutRouter)
app.use("/api/users", signUpRouter)


app.all("*", async () => {
    throw new NotFoundError();
})

app.use(errorHandler)

export { app, PORT }