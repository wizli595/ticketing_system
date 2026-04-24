import mongoose from "mongoose";
import { app, PORT } from "./app";
{{#if nats}}
import { natsWrapper } from "./nats-wrapper";
{{/if}}

const start = async () => {
    if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
{{#if mongo}}
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
{{/if}}
{{#if nats}}
    if (!process.env.NATS_CLIENT_ID) throw new Error("NATS_CLIENT_ID must be defined");
    if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined");
    if (!process.env.NATS_CLUSTER_ID) throw new Error("NATS_CLUSTER_ID must be defined");

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

        natsWrapper.client.on("close", () => {
            console.log("NATS connection closed!!");
            process.exit();
        });
        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());

        // Register event listeners here
        // new SomeListener(natsWrapper.client).listen();
{{/if}}
{{#if mongo}}

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
{{/if}}
{{#if nats}}
    } catch (err) {
        console.error(err);
    }
{{/if}}

    app.listen(PORT, () => {
        console.log(`{{name}} service running on ${PORT}`);
    });
};

start();
