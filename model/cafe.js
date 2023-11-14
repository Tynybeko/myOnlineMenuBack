import mongoose from "mongoose"



const CafeSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
}, {
    timestamps: true
})


export default mongoose.model('Cafe', CafeSchema)