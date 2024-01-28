import request from 'supertest';
import { app } from '../../app';


describe('POST /api/users/signup', function () {
    it('returns a 201 on successful signup', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: "wizli@email.com",
                password: "password"
            })
            .expect(201);

    });
    it('returns a 400 with uncorrect email', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: "wizlfdqffqdsf",
                password: "password"
            })
            .expect(400);

    });

    it('returns a 400 with missing email & password', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: "wizli@email.com"
            })
            .expect(400);
        await request(app)
            .post('/api/users/signup')
            .send({
                password: "hhhhhh"
            })
            .expect(400);

    });

    it('disallows duplicate emails', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(201);

        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(400);
    });
    it('sets a cookie after successful signup', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                email: "wizli@email.com",
                password: "password"
            })
            .expect(201);
        expect(response.get('Set-Cookie')).toBeDefined();
    });
})
