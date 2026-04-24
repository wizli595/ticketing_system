import { {{eventName}} } from "@wizlitickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { {{className}} } from "../{{fileName}}";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new {{className}}(natsWrapper.client);

    const data: {{eventName}}["data"] = {
        // TODO: fill in test data
    } as any;

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};

it("acks the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});
