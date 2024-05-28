import mongoose from "mongoose";
import { Ticket } from "../../models/ticket-model";
import  request from "supertest";
import { app } from "../../app";

describe('GET /api/order/:id   ', function () {
    it("fetches the order", async function () {
        const ticketData = {
            id: new mongoose.Types.ObjectId().toHexString(),
            title: "concert",
            price: 200
        };
        const ticket = await Ticket.build(ticketData);
        await ticket.save();
        const user = global.signin();
        const { body: order } = await request(app)
            .post("/api/orders")
            .set("Cookie", user)
            .send({ ticketId: ticket.id })
            .expect(201);
        const { body: fetchedOrder } = await request(app)
            .get(`/api/orders/${order.id}`)
            .set("Cookie", user)
            .send()
            .expect(200);
        
        expect(fetchedOrder.id).toEqual(order.id);
        
    });
    it("returns an error if one user tries to fetch another user's order", async function () {
        const ticketData = {
            id: new mongoose.Types.ObjectId().toHexString(),
            title: "concert",
            price: 200
        };
        const ticket = await Ticket.build(ticketData);
        await ticket.save();
        const user = global.signin(); 
        const { body: order } = await request(app)
            .post("/api/orders")
            .set("Cookie", user)
            .send({ ticketId: ticket.id })
            .expect(201);
        await request(app)
            .get(`/api/orders/${order.id}`)
            .set("Cookie", global.signin())
            .send()
            .expect(404);
    });
});