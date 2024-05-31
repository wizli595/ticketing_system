import { Listener, OrderCreatedEvent, Subjects } from "@wizlitickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const { ticket, id } = data;
        const ticketDoc = await Ticket.findById(ticket.id);
        if (!ticketDoc) {
            throw new Error("Ticket not found");
        }
        ticketDoc.set({ orderId: id });

        await ticketDoc.save();
        new TicketUpdatedPublisher(this.client).publish({
            id: ticketDoc.id,
            version: ticketDoc.version,
            title: ticketDoc.title,
            price: ticketDoc.price,
            userId: ticketDoc.userId,
            orderId: ticketDoc.orderId,
        });

        msg.ack();
    }
}
