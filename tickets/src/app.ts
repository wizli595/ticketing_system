import express from 'express';
import 'express-async-errors';
import { currentUser, errorHandler, NotFoundError } from '@wizlitickets/common';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';

import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRoute } from './routes/update';
import { destroyTicketRoute } from './routes/destroy';


const app = express()
const PORT = 3000

app.set('trust proxy', true);

const accessLogStrem = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStrem }))

app.use(express.json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUser)

app.use("/api", createTicketRouter);
app.use("/api", showTicketRouter);
app.use('/api', indexTicketRouter)
app.use('/api', updateTicketRoute)
app.use('/api', destroyTicketRoute)



app.all("*", async (req, res) => {
    throw new NotFoundError();
})

app.use(errorHandler)

export { app, PORT }