import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
            quantity: { type: Number, required: true },
        }
    ],
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
    deliveryAddress: { type: String },
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);