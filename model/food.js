import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
    title: {
        require: true,
        type: String,
    },
    title_ky: {
        type: String,
    },
    img: {
        type: String,
        require: true,
    },
    catId: {
        require: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    desc: {
        type: String,
    },
    desc_ky: {
        type: String,
    },
    price: {
        type: String,
        require: true
    },
    size: {
        type: String,
        require: true
    },
    cafeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cafe',
        require: true
    },
    catTitle: {
        type: String,
    },
    recipe: {
        type: Array,
    },
    recipe_ky: {
        type: Array,
    }
}, {
    timestamps: true
})

export default mongoose.model('Food', FoodSchema)
