import request from 'supertest';
import { app } from '../../app';
import { generateObjectId } from '../../../utils/generate-objectId';
import { createTickets } from '../../../utils/create-ticket';
describe('PUT /api/ticktes/:id', function () {
    it('returns a 404 if provided id does not exist', async () => {
        const id = generateObjectId();
        await request(app)
            .put('/api/tickets/' + id)
            .set('Cookie', global.signin())
            .send({ title: 'ali qandil', price: 523 })
            .expect(404)
    });
    it('returns a 401 if user is  not authenticated ', async () => {
        const id = generateObjectId();
        await request(app)
            .put('/api/tickets/' + id)
            .send({ title: 'ali qandil', price: 523 })
            .expect(401)
    });
    it('returns a 401 if the user does not own the ticket ', async () => {
        const response = await createTickets();
        await request(app)
            .put('/api/tickets/' + response.body.id)
            .set('Cookie', global.signin())
            .send({
                title: "jhhhh",
                price: 56
            })
            .expect(401)
    });
    it('returns a 400 if the user provides an invalid title or price ', async () => {
        const cookie = global.signin() //to be the same user
        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', cookie)
            .send({ title: "hi!!", price: 895 })

        await request(app)
            .put('/api/tickets/' + response.body.id)
            .set('Cookie', cookie)
            .send({
                title: '',
                price: 52
            })
            .expect(400);

        await request(app)
            .put('/api/tickets/' + response.body.id)
            .set('Cookie', cookie)
            .send({
                title: 'hello',
                price: -52
            })
            .expect(400)
    });
    it('updates the ticket with valid inputs', async () => {
        const cookie = global.signin();
        const title = "new ep";
        const price = 632

        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', cookie)
            .send({
                title: 'ticket mood',
                price: 896
            })
        await request(app)
            .put('/api/tickets/' + response.body.id)
            .set('Cookie', cookie)
            .send({ title, price })
            .expect(200)

        const ticketResponse = await request(app)
            .get('/api/tickets/' + response.body.id)
            .send()
        expect(ticketResponse.body.title).toEqual(title);
        expect(ticketResponse.body.price).toEqual(price);
    });
})