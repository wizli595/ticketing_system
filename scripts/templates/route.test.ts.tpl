import request from "supertest";
import { app } from "../../app";

it("returns a {{statusCode}} on successful {{verb}}", async () => {
    const cookie = global.signin();

    const response = await request(app)
        .{{verb}}("/api/{{service}}/{{resource}}")
        .set("Cookie", cookie)
        .send({});

    expect(response.status).not.toEqual(401);
});

it("returns 401 if not authenticated", async () => {
    await request(app)
        .{{verb}}("/api/{{service}}/{{resource}}")
        .send({})
        .expect(401);
});
