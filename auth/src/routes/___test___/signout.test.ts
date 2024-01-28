import request from 'supertest';
import { app } from '../../app';


describe('POST /api/users/signout', function () {
    it('clear cookie after signout successfully ', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: "wizli@email.com",
                password: "password"
            })
            .expect(201);
        const response = await request(app)
            .post('/api/users/signout')
            .send({})
            .expect(200);
        expect(response.get('Set-Cookie')[0]).toEqual(
            "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
        );
    })
})