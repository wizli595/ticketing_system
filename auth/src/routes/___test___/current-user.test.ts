import request from 'supertest';
import { app } from '../../app';


describe('GET /api/users/current', function () {

    it('respons with details about the current user', async () => {
        const cookie = await global.signin();
        const response = await request(app)
            .get('/api/users/current')
            .set('Cookie', cookie)
            .expect(200);

        expect(response.body.currentUser.email).toEqual('wizli@email.com')
    });

    it('responds with null if not authenticated', async () => {
        const response = await request(app)
            .get('/api/users/current')
            .send()
            .expect(200);

        expect(response.body.currentUser).toEqual(null);
    });

})
