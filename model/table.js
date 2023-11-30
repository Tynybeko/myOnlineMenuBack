import mongoose from "mongoose";



const TableSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    cafeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cafe',
        require: true
    },
}, {
    timestamps: true
})



export default mongoose.model('Table', TableSchema)