import mongoose from 'mongoose';
import { app, PORT } from './app';

const start = async () => {
    if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defiend')
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log('connect to db');
    } catch (err) {
        console.log(err);
    }
    app.listen(PORT, () => {
        console.log(`auth service running on ${PORT} !!!!`);
    })
}

start();