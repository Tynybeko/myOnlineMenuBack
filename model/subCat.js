import mongoose from "mongoose";


const SubCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    title_ky: {
        type: String,
    },
    catId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
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
    },
    disabled: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


export default mongoose.model('SubCategory', SubCategorySchema)