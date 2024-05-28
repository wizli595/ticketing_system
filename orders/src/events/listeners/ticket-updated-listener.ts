import { Subjects, Listener, TicketUpdated } from "@wizlitickets/common";
import { Ticket } from "../../models/ticket-model";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";

export class TicketUpdatedListener extends Listener<TicketUpdated> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdated["data"], msg: Message) {
        const ticket = await Ticket.findById(data.id);
        if (!ticket) {
            throw new Error("Ticket not found");
        }
        const { title, price } = data;
        ticket.set({ title, price });
        await ticket.save();
        msg.ack();
    }
}
