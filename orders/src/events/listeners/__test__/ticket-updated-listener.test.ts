import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket-model";
import { TicketUpdated } from "@wizlitickets/common";

const setup = async () => {
    // Create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    // Create a fake data event
    const ticket = await Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20,
    });
    await ticket.save();
    const data: TicketUpdated["data"] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: "concertxx",
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    };
    // Create a fake message object
    const msg: Partial<Message> = {
        ack: jest.fn(),
    };
    return { listener, data, ticket, msg };
};

describe("Ticket Updated Listener", () => {
    it("finds, updates, and saves a ticket", async () => {
        const { listener, data, ticket, msg } = await setup();
        // Call the onMessage function with the data object + message object
        await listener.onMessage(data, msg as Message);
        // Write assertions to make sure a ticket was updated
        const updatedTicket = await Ticket.findById(ticket.id);
        expect(updatedTicket!.title).toEqual(data.title);
        expect(updatedTicket!.price).toEqual(data.price);
        expect(updatedTicket!.version).toEqual(data.version);
    });
    it("acks the message", async () => {
        const { listener, data, msg } = await setup();
        // Call the onMessage function with the data object + message object
        await listener.onMessage(data, msg as Message);
        // Write assertions to make sure ack function is called
        expect(msg.ack).toHaveBeenCalled();
    });
    it("does not call ack if the event has a skipped version number", async () => {
        const { listener, data, msg } = await setup();
        data.version = 10;
        try {
            await listener.onMessage(data, msg as Message);
        } catch (err) {
            // do nothing
        }
        expect(msg.ack).not.toHaveBeenCalled();
    });
});
