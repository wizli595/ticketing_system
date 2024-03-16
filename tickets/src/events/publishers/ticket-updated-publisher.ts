import { Publisher, TicketUpdated, Subjects } from '@wizlitickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdated> {
    readonly subject = Subjects.TicketUpdated;
}