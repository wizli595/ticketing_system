import mongoose from 'mongoose';
import { app, PORT } from './app';

const start = async () => {
    if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defiend')
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defiend')

    try {
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