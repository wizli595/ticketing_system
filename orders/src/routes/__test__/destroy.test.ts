import request from "supertest";
import { app } from "../../app";
import { OrderStatus } from "@wizlitickets/common";
import mongoose from "mongoose";
import { Order } from "../../models/order-model";
import { Ticket } from "../../models/ticket-model";
import { natsWrapper } from "../../nats-wrapper";

describe("DELETE /api/orders/:id", () => {
    it("marks an order as cancelled", async () => {
        const user = global.signin();
        const ticket = {
            id: new mongoose.Types.ObjectId().toHexString(),
            title: "concert",
            price: 20,
        };
        const ticketDoc = await Ticket.build(ticket);
        await ticketDoc.save();
        const { body: order } = await request(app)
            .post("/api/orders")
            .set("Cookie", user)
            .send({ ticketId: ticketDoc.id })
            .expect(201);
        await request(app)
            .delete(`/api/orders/${order.id}`)
            .set("Cookie", user)
            .send()
            .expect(204);
        const updatedOrder = await Order.findById(order.id);
        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    });
    it("emits an order cancelled event", async () => {
        const user = global.signin();
        const ticket = {
            id: new mongoose.Types.ObjectId().toHexString(),
            title: "concert",
            price: 20,
        };
        const ticketDoc = await Ticket.build(ticket);
        await ticketDoc.save();
        const { body: order } = await request(app)
            .post("/api/orders")
            .set("Cookie", user)
            .send({ ticketId: ticketDoc.id })
            .expect(201);
        await request(app)
            .delete(`/api/orders/${order.id}`)
            .set("Cookie", user)
            .send()
            .expect(204);
        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
});
