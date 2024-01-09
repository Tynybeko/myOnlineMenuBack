import mongoose from "mongoose";

const PromotionSchema = mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String },
    discount: { type: Number, default: 0 },
    cafeId: { type: mongoose.Schema.Types.ObjectId, require: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }],
    foods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
    img: { type: String, default: '' },
})

export default mongoose.model('Promotion', PromotionSchema);
