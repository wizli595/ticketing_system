import { Publisher, TicketCreatedEvent, Subjects } from '@wizlitickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}