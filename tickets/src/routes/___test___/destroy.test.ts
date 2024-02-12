import request from 'supertest';
import { app } from '../../app';
import { createTickets } from '../../../utils/create-ticket';
import { generateObjectId } from '../../../utils/generate-objectId';

describe('DELETE /api/tickets/:id', function () {
    it('returns 404 if the ticket not found', async () => {
        const id = generateObjectId();

        await request(app)
            .delete('/api/tickets/' + id)
            .set('Cookie', global.signin())
            .send()
            .expect(404)
    })

    it('returns a 401 if user is  not authenticated ', async () => {
        const id = generateObjectId();
        await request(app)
            .delete('/api/tickets/' + id)
            .send()
            .expect(401)
    });

    it('returns a 401 if user does not own the ticket', async () => {
        const response = await createTickets();
        await request(app)
            .delete('/api/tickets/' + response.body.id)
            .set('Cookie', global.signin())
            .send()
            .expect(401)
    });
    it('returns 204 if ticket got deleted successfully', async () => {
        const cookie = global.signin();
        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', cookie)
            .send({
                title: 'ticket mood',
                price: 896
            })

        await request(app)
            .delete('/api/tickets/' + response.body.id)
            .set('Cookie', cookie)
            .send()
            .expect(204)
        const ticketResponse = await request(app)
            .get('/api/tickets/' + response.body.id)
            .send()
            .expect(404)
    })
})
