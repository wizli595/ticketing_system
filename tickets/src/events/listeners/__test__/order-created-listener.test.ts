import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@wizlitickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 99,
        userId: "asdf",
    });
    await ticket.save();

    // Create the fake data event
    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: "alskdfj",
        expiresAt: "alskdjf",
        ticket: {
            id: ticket.id,
            price: ticket.price,
        },
    };

    const msg: Partial<Message> = {
        ack: jest.fn(),
    };

    return { listener, ticket, data, msg };
};
describe("Order Created Listener", () => {
    it("sets the userId of the ticket", async () => {
        const { listener, ticket, data, msg } = await setup();

        await listener.onMessage(data, msg as Message);

        const updatedTicket = await Ticket.findById(ticket.id);

        expect(updatedTicket!.orderId).toEqual(data.id);
    });

    it("acks the message", async () => {
        const { listener, data, msg } = await setup();
        await listener.onMessage(data, msg as Message);

        expect(msg.ack).toHaveBeenCalled();
    });

    it("publishes a ticket updated event", async () => {
        const { listener, data, msg } = await setup();

        await listener.onMessage(data, msg as Message);

        expect(natsWrapper.client.publish).toHaveBeenCalled();

        const ticketUpdatedData = JSON.parse(
            (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
        );
        console.log(ticketUpdatedData);

        expect(data.id).toEqual(ticketUpdatedData.orderId);
    });
});
