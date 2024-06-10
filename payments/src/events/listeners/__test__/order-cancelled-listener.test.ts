import { OrderCancelledEvent, OrderStatus } from "@wizlitickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order-model";

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    // Create a fake data event
    const data: OrderCancelledEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
        },
    };

    const msg: Partial<Message> = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};

describe("Order Cancelled Listener", () => {
    it("updates the status of the order", async () => {
        const { listener, data, msg } = await setup();

        const order = Order.build({
            id: data.id,
            version: 0,
            userId: "some user",
            price: 10,
            status: OrderStatus.Created,
        });
        await order.save();

        await listener.onMessage(data, msg as Message);

        const updatedOrder = await Order.findById(data.id);

        expect(updatedOrder!.status).toEqual("Cancelled");
    });

    it("acks the message", async () => {
        const { listener, data, msg } = await setup();

        await listener.onMessage(data, msg as Message);

        expect(msg.ack).toHaveBeenCalled();
    });
});
