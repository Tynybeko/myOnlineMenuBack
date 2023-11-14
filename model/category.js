import mongoose from "mongoose";


const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    cafeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cafe',
        require: true
    },
    isDelete: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true
})


export default mongoose.model('Category', CategorySchema)