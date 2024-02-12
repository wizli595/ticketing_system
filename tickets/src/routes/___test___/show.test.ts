import request from 'supertest';
import { app } from '../../app';
import { generateObjectId } from '../../../utils/generate-objectId';
import { createTickets } from '../../../utils/create-ticket';

describe('GET /api/ticket/:id', function () {
    it('returns a 404 if the ticket is not found', async () => {
        const id = generateObjectId()
        await request(app)
            .get('/api/tickets/' + id)
            .send()
            .expect(404)
    });

    it('returns the ticket if the ticket is found', async () => {
        const title = 'the sopranos ep 1';
        const price = 500;

        const response = await createTickets(title, price)
        const ticketResponse = await request(app)
            .get(`/api/tickets/${response.body.id}`)
            .send()
            .expect(200);

        expect(ticketResponse.body.title).toEqual(title);
        expect(ticketResponse.body.price).toEqual(price);
    })
})
