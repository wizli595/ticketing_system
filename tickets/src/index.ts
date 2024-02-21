import mongoose from 'mongoose';
import { app, PORT } from './app';
import { natsWrapper } from '../utils/nats-wrapper';

const start = async () => {
    if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defiend')
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defiend')

    try {
        await natsWrapper.connect('ticketing', 'hgdsfuj', 'http://nats-srv:4222')

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!!');
            process.exit();
        })
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close())

        await mongoose.connect(process.env.MONGO_URI);
        console.log('connect to db');
    } catch (err) {
        console.log(err);
    }
    app.listen(PORT, () => {
        console.log(`tickets service running on ${PORT} !!!!`);
    })
}

start();