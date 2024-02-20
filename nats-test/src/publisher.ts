import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { Publisher } from './event/base-publisher';
import { TicketCreatedPublisher } from './event/ticket-created-publisher';

console.clear()

const clientID = randomBytes(4).toString('hex')

const stan = nats.connect('ticketing', clientID, {
    url: 'http://localhost:4222'
});

stan.on('connect', async () => {
    console.log('Publisher connected to NATS ');

    const publisher = new TicketCreatedPublisher(stan)

    await publisher.publish({
        id: '123',
        title: "labess",
        price: 96
    })

    // const data = JSON.stringify({
    //     id: '123',
    //     title: "labess",
    //     price: 96
    // });
    // stan.publish('ticket:created', data, () => {
    //     console.log("event published");
    // })
})