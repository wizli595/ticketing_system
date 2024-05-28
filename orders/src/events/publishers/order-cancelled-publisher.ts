import { Subjects, Publisher, OrderCancelledEvent } from "@wizlitickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
