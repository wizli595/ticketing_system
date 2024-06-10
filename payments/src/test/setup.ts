import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
    // eslint-disable-next-line no-var
    var signin: (id?: string) => string[];
}

jest.mock("../nats-wrapper");
let mongo: MongoMemoryServer;
beforeAll(async () => {
    process.env.JWT_KEY = "huhjh";
    // console.log('NODE_ENV:', process.env.NODE_ENV);
    mongo = await MongoMemoryServer.create();

    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    // clear all mocks
    jest.clearAllMocks();

    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop;
    await mongoose.connection.close();
});

export {};

declare global {
    interface Global {
        signin: () => string[];
    }
}

global.signin = (id?: string) => {
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: "wizli@email.com",
    };

    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = { jwt: token };
    const sessionJSON = JSON.stringify(session);
    const base64 = Buffer.from(sessionJSON).toString("base64");
    return [`session=${base64}`];
};
