import { app } from "../src/app"
import request from 'supertest';

export const createTickets = (title = "consert", price = 500) => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price
        })
}