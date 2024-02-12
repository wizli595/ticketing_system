import request from 'supertest';
import { app } from '../../app';
import { createTickets } from '../../../utils/create-ticket';


describe('GET /api/ticket', function () {
    it('can fetch a list of tickets', async () => {
        await createTickets();
        await createTickets();
        await createTickets();
        const response = await request(app)
            .get('/api/tickets')
            .send()
            .expect(200);
        expect(response.body.length).toEqual(3)
    })
})