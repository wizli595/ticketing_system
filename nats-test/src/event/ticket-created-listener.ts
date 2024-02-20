import { Listener } from './base-listener';
import { Message } from 'node-nats-streaming';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName: string = 'name-srv'

    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data!', data);

        msg.ack()
    }
}