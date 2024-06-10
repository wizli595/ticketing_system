import { Subjects, Listener, OrderCreatedEvent } from "@wizlitickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order-model";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const { id, status, userId, version, ticket } = data;
        const order = Order.build({
            id,
            version,
            userId,
            price: ticket.price,
            status,
        });
        await order.save();

        msg.ack();
    }
}
