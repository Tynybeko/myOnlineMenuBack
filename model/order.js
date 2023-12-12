import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    items: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
            quantity: { type: Number, required: true },
        }
    ],
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);