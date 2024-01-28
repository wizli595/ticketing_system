import request from 'supertest';
import { app } from '../../app';

describe('POST /api/users/signin', function () {
    
    it('fails when a email that does not exist is supplied', async () => {
        await request(app)
            .post('/api/users/signin')
            .send({
                email: "wizli@email.com",
                password: "password"
            }).expect(400)
    })


    it('fails when an incorrect password is supplied', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: "wizli@email.com",
                password: "password"
            })
            .expect(201);
        await request(app)
            .post('/api/users/signin')
            .send({
                email: "wizli@email.com",
                password: "passworddd"
            })
            .expect(400);
    })

    it('reponds with a cookie when given valid credentials', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: "wizli@email.com",
                password: "password"
            })
            .expect(201);
        const response = await request(app)
            .post('/api/users/signin')
            .send({
                email: "wizli@email.com",
                password: "password"
            })
            .expect(200);
        expect(response.get('Set-Cookie')).toBeDefined();
    })
})