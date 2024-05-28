import mongoose from 'mongoose'
import { OrderStatus } from '@wizlitickets/common'
import { TicketDoc } from './ticket-model';

export {OrderStatus}
interface Order {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: Order): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId : {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum:Object.values(OrderStatus),
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
},
{
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
}
)

orderSchema.statics.build = (attrs: Order) => {
    return new Order(attrs);
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };