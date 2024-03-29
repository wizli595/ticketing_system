import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { generateObjectId } from '../../utils/generate-objectId';

declare global {
    var signin: () => string[];
}

jest.mock('../../utils/nats-wrapper', () => {
    return {
        natsWrapper: {
            client: {
                publish: jest.fn((subject, data, callback) => {
                    console.log("Publish mock called");
                    callback();
                }),
            },
        },
    };
});
let mongo: any
beforeAll(async () => {

    process.env.JWT_KEY = "huhjh";
    // console.log('NODE_ENV:', process.env.NODE_ENV);
    mongo = await MongoMemoryServer.create();

    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
})


afterAll(async () => {
    await mongo.stop;
    await mongoose.connection.close();
})

global.signin = () => {
    const payload = {
        id: generateObjectId(),
        email: "wizli@email.com"
    }

    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = { jwt: token }
    const sessionJSON = JSON.stringify(session);
    const base64 = Buffer.from(sessionJSON).toString('base64');
    return [`session=${base64}`];
}