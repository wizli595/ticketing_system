import mongoose from 'mongoose';
import { app, PORT } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
    if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defiend')
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defiend')
    if (!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID must be defiend')
    if (!process.env.NATS_URL) throw new Error('NATS_URL must be defiend')
    if (!process.env.NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID must be defiend')

    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID , process.env.NATS_URL)

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!!');
            process.exit();
        })
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close())
        console.log(process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('connect to db');
    } catch (err) {
        console.log(err);
    }
    app.listen(PORT, () => {
        console.log(`ORDER service running on ${PORT} !!!!`);
    })
}

start();