import { Subjects, Publisher, PaymentCreatedEvent } from "@wizlitickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}
