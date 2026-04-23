import { Listener, OrderCreatedEvent, Subjects } from "@wizlitickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        try {
            const { ticket, id } = data;
            const ticketId = typeof ticket.id === 'string' ? ticket.id : String(ticket.id);
            const ticketDoc = await Ticket.findById(ticketId);
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
                orderId: ticketDoc?.orderId,
            });

            msg.ack();
        } catch (err) {
            console.error("Error processing OrderCreated event, acking to skip:", err);
            msg.ack();
        }
    }
}
