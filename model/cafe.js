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
    },
    address: {
        city: {
            type: String,
        },
        sreet: {
            type: String,
        },
        build: {
            type: String,
        }
    }
    
}, {
    timestamps: true
})


export default mongoose.model('Cafe', CafeSchema)