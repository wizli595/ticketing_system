import mongoose from 'mongoose';

interface TicketAttrs {
    title: string;
    price: number;
    userId: mongoose.Types.ObjectId
}
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: mongoose.Types.ObjectId
}

interface TicketModel {

}