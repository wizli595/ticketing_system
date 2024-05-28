import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/ticket-model";
import { Order, OrderStatus } from "../../models/order-model";
import { natsWrapper } from "../../nats-wrapper";
describe("POST /api/orders", function () {
    it("returns an error if the ticket does not exist", async () => {
        const ticketId = new mongoose.Types.ObjectId();
        await request(app)
            .post("/api/orders")
            .set("Cookie", global.signin())
            .send({
                ticketId,
            })
            .expect(404);
    });
    it("returns an error if the ticket is already reserved", async () => {
        const ticket = {
            id: new mongoose.Types.ObjectId().toHexString(),
            title: "concert",
            price: 20,
        };
        const ticketDoc = await Ticket.build(ticket);
        await ticketDoc.save();
        const order = {
            ticket: ticketDoc,
            userId: "123",
            status: OrderStatus.Created,
            expiresAt: new Date(),
        };
        const orderDoc = await Order.build(order);
        await orderDoc.save();
        await request(app)
            .post("/api/orders")
            .set("Cookie", global.signin())
            .send({
                ticketId: ticketDoc.id,
            })
            .expect(400);
    });

    it("reserves a ticket", async () => {
        const ticket = {
            id: new mongoose.Types.ObjectId().toHexString(),
            title: "concert",
            price: 20,
        };
        const ticketDoc = await Ticket.build(ticket);
        await ticketDoc.save();
        await request(app)
            .post("/api/orders")
            .set("Cookie", global.signin())
            .send({
                ticketId: ticketDoc.id,
            })
            .expect(201);
    });
    it("publishes an event", async () => {
        const ticket = {
            id: new mongoose.Types.ObjectId().toHexString(),
            title: "concert",
            price: 20,
        };
        const ticketDoc = await Ticket.build(ticket);
        await ticketDoc.save();
        await request(app)
            .post("/api/orders")
            .set("Cookie", global.signin())
            .send({
                ticketId: ticketDoc.id,
            })
            .expect(201);
        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
});
