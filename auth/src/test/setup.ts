import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';


declare global {
    // eslint-disable-next-line no-var
    var signin: () => Promise<string[]>;
}
  


let mongo: MongoMemoryServer;
beforeAll(async () => {

    process.env.JWT_KEY = "huhjh";
    // console.log('NODE_ENV:', process.env.NODE_ENV);
    mongo = await MongoMemoryServer.create();

    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
})


afterAll(async () => {
    await mongo.stop;
    await mongoose.connection.close();
})



global.signin = async () => {
    const credentials = {
        email: "wizli@email.com",
        password: "password"
    };
    const response = await request(app)
        .post('/api/users/signup')
        .send(credentials)
        .expect(201);

    const cookie = response.get('Set-Cookie');

    return cookie;
};
