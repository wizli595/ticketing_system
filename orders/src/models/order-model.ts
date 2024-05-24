import mongoose from 'mongoose'

interface Order {
    userId: string;
    status: string;
    expiresAt: Date;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: string;
    expiresAt: Date;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: Order): OrderDoc;
}
