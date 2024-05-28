import { Subjects, Publisher, OrderCreatedEvent } from "@wizlitickets/common";
export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
