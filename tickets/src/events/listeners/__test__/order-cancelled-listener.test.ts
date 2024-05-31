import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent } from "@wizlitickets/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: "concert",
        price: 99,
        userId: "asdf",
    });
    ticket.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await ticket.save();

    const data: OrderCancelledEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id,
        },
    };

    const msg: Partial<Message> = {
        ack: jest.fn(),
    };

    return { listener, ticket, data, msg };
};
describe("Order Cancelled Listener", () => {
    it("updates the ticket, publishes an event, and acks the message", async () => {
        const { listener, ticket, data, msg } = await setup();

        await listener.onMessage(data, msg as Message);

        const updatedTicket = await Ticket.findById(ticket.id);

        expect(updatedTicket!.orderId).not.toBeDefined();
        expect(msg.ack).toHaveBeenCalled();
        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
});
