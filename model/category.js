import mongoose from "mongoose";


const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    title_ky: {
        type: String,
    },
    cafeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cafe',
        require: true,
    },
    isDelete: {
        type: Boolean,
        default: true,
    },
    disabled: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


export default mongoose.model('Category', CategorySchema)